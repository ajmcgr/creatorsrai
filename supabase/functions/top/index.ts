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

async function fetchFromSocialBlade(platform: Platform): Promise<any[]> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID')!;
  const SB_TOKEN = Deno.env.get('SB_TOKEN')!;
  const SB_BASE_URL = Deno.env.get('SB_BASE_URL')!;

  const endpoints = {
    youtube: '/youtube/top?query=subscribers&page=1',
    tiktok: '/tiktok/top?query=followers&page=1',
    instagram: '/instagram/top?query=followers&page=1'
  };

  const url = `${SB_BASE_URL}${endpoints[platform]}`;
  
  console.log(`Fetching ${platform} data from Social Blade: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'clientid': SB_CLIENT_ID,
      'token': SB_TOKEN,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Social Blade API error for ${platform}:`, response.status, response.statusText);
    throw new Error(`SocialBlade error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Successfully fetched ${platform} data:`, data?.length || 0, 'items');
  
  return Array.isArray(data) ? data : [];
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
      console.log(`Cache hit for ${platform}`);
      const items = normalizeTop(platform, cachedData.data_json as any[]);
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

    // Cache miss - fetch from Social Blade
    console.log(`Cache miss for ${platform}, fetching from Social Blade`);
    const rawData = await fetchFromSocialBlade(platform);
    
    if (rawData.length === 0) {
      console.warn(`No data returned from Social Blade for ${platform}`);
    }

    // Update cache
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

    const items = normalizeTop(platform, rawData);
    
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