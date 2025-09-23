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

function sbTopUrl(platform: Platform): string {
  const SB_BASE = Deno.env.get('SB_BASE_URL') || 'https://matrix.sbapis.com/b';
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE}/${platform}/top?query=${query}&page=1`;
}

async function fetchSbTop(platform: Platform): Promise<any> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID');
  const SB_TOKEN = Deno.env.get('SB_TOKEN');
  
  if (!SB_CLIENT_ID || !SB_TOKEN) {
    throw new Error('Social Blade credentials not configured');
  }

  console.log(`Fetching ${platform} data from Social Blade...`);
  
  const res = await fetch(sbTopUrl(platform), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`SocialBlade ${platform} ${res.status}: ${text}`);
    throw new Error(`SocialBlade ${platform} ${res.status}: ${text}`);
  }
  
  const data = await res.json();
  console.log(`Successfully fetched ${platform} data:`, data?.length || 0, 'items');
  return data;
}

function normalizeTop(platform: Platform, raw: any[]): TopItem[] {
  if (!Array.isArray(raw)) {
    console.warn('Raw data is not an array:', raw);
    return [];
  }
  
  return raw.map((it: any, i: number) => ({
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

    // Try to get cached data first
    const cached = await getCachedData(supabase, platform);
    if (cached?.data_json) {
      const response: TopResponse = {
        fetched_at: cached.fetched_at,
        items: normalizeTop(platform, cached.data_json)
      };
      
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch fresh data from Social Blade
    console.log(`Fetching fresh data for ${platform}...`);
    const raw = await fetchSbTop(platform);
    
    // Cache the fresh data
    await setCachedData(supabase, platform, raw);

    const response: TopResponse = {
      fetched_at: new Date().toISOString(),
      items: normalizeTop(platform, raw)
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