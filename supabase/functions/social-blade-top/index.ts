import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';

interface TopItem {
  rank: number;
  id: string;
  displayName: string;
  username?: string;
  avatar?: string;
  followers: number;
  platform: Platform;
}

interface TopResponse {
  fetched_at: string;
  items: TopItem[];
}

function sbTopUrl(platform: Platform, page: number = 1): string {
  const SB_BASE = Deno.env.get('SB_BASE_URL') || 'https://matrix.sbapis.com/b';
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE}/${platform}/top?query=${query}&page=${page}`;
}

async function fetchSbTopPage(platform: Platform, page: number): Promise<any> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID');
  const SB_TOKEN = Deno.env.get('SB_TOKEN');
  
  if (!SB_CLIENT_ID || !SB_TOKEN) {
    throw new Error('Social Blade credentials not configured');
  }

  console.log(`Fetching ${platform} data from Social Blade page ${page}...`);
  
  const res = await fetch(sbTopUrl(platform, page), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`SocialBlade ${platform} page ${page} ${res.status}: ${text}`);
    throw new Error(`SocialBlade ${platform} page ${page} ${res.status}: ${text}`);
  }
  
  const data = await res.json();
  console.log(`Successfully fetched ${platform} page ${page} data:`, Array.isArray(data) ? data.length : (data?.data?.length || 0), 'items');
  return data;
}

async function fetchSbTop(platform: Platform, limit: number = 100): Promise<any> {
  if (limit <= 100) {
    return await fetchSbTopPage(platform, 1);
  }
  
  console.log(`Fetching Top-200 for ${platform} by merging pages 1 & 2`);
  
  // Fetch both pages in parallel
  const [page1Data, page2Data] = await Promise.all([
    fetchSbTopPage(platform, 1),
    fetchSbTopPage(platform, 2)
  ]);

  // Merge the results - handle nested data structure
  const page1Array = Array.isArray(page1Data) ? page1Data : (page1Data?.data || []);
  const page2Array = Array.isArray(page2Data) ? page2Data : (page2Data?.data || []);
  
  const merged = [...page1Array, ...page2Array];
  console.log(`Merged ${platform} data: ${page1Array.length} + ${page2Array.length} = ${merged.length} items`);
  
  return merged;
}

function normalizeTop(platform: Platform, raw: any): TopItem[] {
  // Handle the Social Blade API response format
  let dataArray = raw;
  
  // Check if the response has a nested structure with status and data
  if (raw && typeof raw === 'object' && raw.data && Array.isArray(raw.data)) {
    dataArray = raw.data;
  } else if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    console.warn('Unexpected data structure:', raw);
    return [];
  }
  
  if (!Array.isArray(dataArray)) {
    console.warn('Raw data is not an array:', raw);
    return [];
  }
  
  return dataArray.map((item: any, i: number) => {
    // Handle Social Blade's nested structure
    const id = item.id?.id || item.id?.username || item.userid || item.username || item.channelid || `${platform}-${i}`;
    const displayName = item.id?.display_name || item.displayname || item.title || item.username || item.channelname || 'Unknown';
    const username = item.id?.handle?.replace('@', '') || item.id?.username || item.username || item.handle?.replace('@', '') || undefined;
    const followers = platform === 'youtube' 
      ? (item.statistics?.total?.subscribers ?? item.subscribers ?? item.subscriberCount ?? 0)
      : (item.statistics?.total?.followers ?? item.followers ?? item.followerCount ?? 0);

    return {
      rank: i + 1,
      id,
      displayName,
      username,
      avatar: item.avatar || item.profile_picture || item.thumbnail || undefined,
      followers,
      platform
    };
  });
}

async function getCachedData(supabase: any, platform: Platform): Promise<any> {
  const CACHE_TTL_HOURS = 168; // 7 days
  
  const { data, error } = await supabase
    .from('top_cache')
    .select('data_json, fetched_at')
    .eq('platform', platform)
    .eq('page', 1)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error || !data) {
    console.log(`No cached data for ${platform}:`, error?.message);
    return null;
  }

  const ageHours = (Date.now() - new Date(data.fetched_at).getTime()) / (1000 * 60 * 60);
  if (ageHours > CACHE_TTL_HOURS) {
    console.log(`Cached data for ${platform} is stale (${ageHours.toFixed(1)} hours old)`);
    return null;
  }
  
  console.log(`Using cached data for ${platform} (${ageHours.toFixed(1)} hours old)`);
  return data;
}

async function setCachedData(supabase: any, platform: Platform, raw: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('top_cache')
      .upsert({
        platform,
        page: 1,
        data_json: raw,
        fetched_at: new Date().toISOString(),
        metric: platform === 'youtube' ? 'subscribers' : 'followers',
        week_start: new Date().toISOString().split('T')[0]
      });
      
    if (error) {
      console.error(`Failed to cache data for ${platform}:`, error);
    } else {
      console.log(`Successfully cached data for ${platform}`);
    }
  } catch (err) {
    console.error(`Error caching data for ${platform}:`, err);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const platform = (url.searchParams.get('platform') || 'youtube').toLowerCase() as Platform;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(Number(limitParam), 100), 200) : 100; // Default 100, max 200
    
    const ALLOWED_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram'];
    if (!ALLOWED_PLATFORMS.includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'Invalid platform. Must be youtube, tiktok, or instagram' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get cached data first - but only if we have enough data
    const cached = await getCachedData(supabase, platform);
    if (cached?.data_json) {
      const cachedArray = Array.isArray(cached.data_json) ? cached.data_json : (cached.data_json?.data || []);
      
      // Only use cache if it has enough data for the requested limit
      if (cachedArray.length >= limit || (limit <= 100 && cachedArray.length >= 100)) {
        const response: TopResponse = {
          fetched_at: cached.fetched_at,
          items: normalizeTop(platform, cachedArray).slice(0, limit)
        };
        
        return new Response(
          JSON.stringify(response),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch fresh data from Social Blade (fetch 200 for cache, slice to limit for response)
    console.log(`Fetching fresh data for ${platform} (Top-${limit === 200 ? '200' : '100'})...`);
    const raw = await fetchSbTop(platform, 200); // Always fetch 200 for cache
    
    // Cache the fresh data
    await setCachedData(supabase, platform, raw);

    const response: TopResponse = {
      fetched_at: new Date().toISOString(),
      items: normalizeTop(platform, raw).slice(0, limit)
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in social-blade-top function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});