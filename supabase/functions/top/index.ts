import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';
type TopItem = {
  rank: number;
  id: string;
  displayName: string;
  username?: string;
  avatar?: string;
  followers: number;
  platform: Platform;
};
type TopResponse = { fetched_at: string; items: TopItem[] };

const CACHE_TTL_HOURS = 168; // 7 days
const PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram'];

function normalizeTop(platform: Platform, raw: any[]): TopItem[] {
  return (raw ?? []).map((it: any, i: number) => ({
    rank: i + 1,
    id: it.id || it.userid || it.username || it.channelid || `${platform}-${i}`,
    displayName: it.displayname || it.title || it.username || it.channelname || 'Unknown',
    username: it.username || it.handle || undefined,
    avatar: it.avatar || it.profile_picture || it.thumbnail || undefined,
    followers: platform === 'youtube'
      ? (it.subscribers ?? it.subscriberCount ?? 0)
      : (it.followers ?? it.followerCount ?? 0),
    platform
  }));
}

async function fetchFromSocialBladePage(platform: Platform, page: number): Promise<any[]> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID')!;
  const SB_TOKEN = Deno.env.get('SB_TOKEN')!;
  const SB_BASE_URL = Deno.env.get('SB_BASE_URL')!;

  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  const url = `${SB_BASE_URL}/${platform}/top?query=${query}&page=${page}`;
  
  console.log(`Fetching ${platform} data from Social Blade page ${page}: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'clientid': SB_CLIENT_ID,
      'token': SB_TOKEN,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Social Blade API error for ${platform} page ${page}:`, response.status, response.statusText);
    throw new Error(`SocialBlade error: ${response.status}`);
  }

  const data = await response.json();
  const dataArray = Array.isArray(data) ? data : (data?.data || []);
  console.log(`Successfully fetched ${platform} page ${page} data:`, dataArray.length, 'items');
  
  return dataArray;
}

async function fetchFromSocialBlade(platform: Platform, limit = 200): Promise<any[]> {
  if (limit <= 100) {
    return await fetchFromSocialBladePage(platform, 1);
  }
  
  console.log(`Fetching Top-200 for ${platform} by merging pages 1 & 2`);
  
  // Fetch both pages in parallel
  const [page1Data, page2Data] = await Promise.all([
    fetchFromSocialBladePage(platform, 1),
    fetchFromSocialBladePage(platform, 2)
  ]);

  // Merge the results
  const merged = [...page1Data, ...page2Data];
  console.log(`Merged ${platform} data: ${page1Data.length} + ${page2Data.length} = ${merged.length} items`);
  
  return merged;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const url = new URL(req.url);
    const platform = url.searchParams.get('platform') as Platform;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(Number(limitParam), 100), 200) : 200; // Default to 200, cap at 200

    if (!platform || !PLATFORMS.includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'Invalid platform. Must be: youtube, tiktok, or instagram' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check cache first
    const cacheThreshold = new Date(Date.now() - (CACHE_TTL_HOURS * 60 * 60 * 1000));
    const { data: cachedData, error: cacheError } = await supabase
      .from('top_cache')
      .select('data_json, fetched_at')
      .eq('platform', platform)
      .gte('fetched_at', cacheThreshold.toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheError) {
      console.error('Cache query error:', cacheError);
    }

    if (cachedData && cachedData.data_json) {
      const cachedArray = Array.isArray(cachedData.data_json) ? cachedData.data_json : [];
      
      // Only use cache if it has enough data for the requested limit
      if (cachedArray.length >= limit || (limit <= 100 && cachedArray.length >= 100)) {
        console.log(`Cache hit for ${platform}, using ${Math.min(limit, cachedArray.length)} items`);
        const items = normalizeTop(platform, cachedArray).slice(0, limit);
        return new Response(
          JSON.stringify({
            fetched_at: cachedData.fetched_at,
            items
          } satisfies TopResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Cache miss - fetch from Social Blade (Top-200 by default)
    console.log(`Cache miss for ${platform}, fetching Top-200 from Social Blade`);
    const rawData = await fetchFromSocialBlade(platform, 200); // Always fetch 200 for cache
    
    if (rawData.length === 0) {
      console.warn(`No data returned from Social Blade for ${platform}`);
    }

    // Update cache with the full dataset
    const now = new Date().toISOString();
    const { error: upsertError } = await supabase
      .from('top_cache')
      .upsert({
        platform,
        page: 1,
        data_json: rawData,
        fetched_at: now
      }, {
        onConflict: 'platform'
      });

    if (upsertError) {
      console.error('Cache upsert error:', upsertError);
    }

    const items = normalizeTop(platform, rawData).slice(0, limit);
    
    return new Response(
      JSON.stringify({
        fetched_at: now,
        items
      } satisfies TopResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('API error:', error);
    
    if (error.message?.includes('SocialBlade error')) {
      return new Response(
        JSON.stringify({ 
          error: 'SocialBlade error', 
          status: error.message.split(':')[1]?.trim() || 'unknown'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});