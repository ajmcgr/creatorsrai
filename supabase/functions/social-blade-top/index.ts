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

// Social Blade helpers
const SB_BASE = Deno.env.get('SB_BASE_URL') || 'https://matrix.sbapis.com/b';
const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID')!;
const SB_TOKEN = Deno.env.get('SB_TOKEN')!;

function topUrl(platform: Platform, page: number) {
  const q = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE}/${platform}/top?query=${q}&page=${page}`; // SB is 1-indexed
}

async function fetchTopPage(platform: Platform, page: number) {
  console.log(`Fetching ${platform} page ${page} from Social Blade...`);
  
  const res = await fetch(topUrl(platform, page), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    console.error(`SB top ${platform} p${page} ${res.status}: ${t}`);
    throw new Error(`SB top ${platform} p${page} ${res.status}: ${t}`);
  }
  
  const data = await res.json();
  console.log(`Successfully fetched ${platform} page ${page}:`, Array.isArray(data) ? data.length : (data?.data?.length || 0), 'items');
  return data;
}

async function fetchTopMerged(platform: Platform, limit: number) {
  // Always fetch page 1
  const p1 = await fetchTopPage(platform, 1);
  if (limit <= 100) {
    return p1;
  }

  console.log(`Fetching Top-200 for ${platform} by attempting page 2 (graceful fallback if unavailable)`);

  try {
    const p2 = await fetchTopPage(platform, 2);
    const arr = (Array.isArray(p1) ? p1 : p1?.data || []).concat(
      Array.isArray(p2) ? p2 : p2?.data || []
    );
    console.log(`Merged ${platform} data: ${(Array.isArray(p1) ? p1 : p1?.data || []).length} + ${(Array.isArray(p2) ? p2 : p2?.data || []).length} = ${arr.length} items`);
    return arr;
  } catch (err: any) {
    console.warn(`Page 2 fetch failed for ${platform}, returning page 1 only. Reason: ${err?.message || err}`);
    const arr = Array.isArray(p1) ? p1 : p1?.data || [];
    return arr;
  }
}

function normalizeTop(platform: Platform, raw: any[]): TopItem[] {
  const src = Array.isArray(raw) ? raw : (raw?.data || []);
  return src.map((it: any, i: number) => ({
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

// Cache helpers
const CACHE_TTL_HOURS = Number(Deno.env.get('CACHE_TTL_HOURS') || '168'); // 7 days default

function supa() {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function cacheGet(platform: Platform) {
  const client = supa();
  if (!client) return null;
  
  const { data } = await client
    .from('top_cache')
    .select('data_json, fetched_at')
    .eq('platform', platform)
    .maybeSingle();
    
  if (!data) return null;
  
  const ageHours = (Date.now() - new Date(data.fetched_at).getTime()) / (1000 * 60 * 60);
  if (ageHours > CACHE_TTL_HOURS) return null;
  
  return data;
}

async function cacheSet(platform: Platform, raw: any) {
  const client = supa();
  if (!client) return;
  
  await client.from('top_cache').upsert({
    platform,
    page: 1,
    data_json: raw,
    fetched_at: new Date().toISOString()
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const platform = (url.searchParams.get('platform') || 'youtube').toLowerCase() as Platform;
    const bypassCache = url.searchParams.get('bypassCache') === '1';
    const limitParam = url.searchParams.get('limit');
    const DEFAULT_LIMIT = Number(Deno.env.get('TOP_LIMIT') || '200'); // Default 200 as per spec
    const lim = limitParam ? Number(limitParam) : DEFAULT_LIMIT;
    const limit = lim >= 200 ? 200 : 100;
    
    const ALLOWED_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram'];
    if (!ALLOWED_PLATFORMS.includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'Invalid platform. Must be youtube, tiktok, or instagram' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching ${platform} data (limit: ${limit}, bypassCache: ${bypassCache})`);

    // Try cache first unless bypassed
    if (!bypassCache) {
      const cached = await cacheGet(platform);
      if (cached?.data_json) {
        const cachedArray = Array.isArray(cached.data_json) ? cached.data_json : (cached.data_json?.data || []);
        
        // Only use cache if it has enough data for the requested limit
        if (cachedArray.length && ((limit === 100 && cachedArray.length >= 100) || (limit === 200 && cachedArray.length >= 200))) {
          console.log(`Cache hit for ${platform}, returning ${Math.min(limit, cachedArray.length)} items`);
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
    }

    // Live fetch merged pages (page=1 [+ page=2 if limit=200])
    console.log(`Cache miss for ${platform}, fetching live data...`);
    const rawData = await fetchTopMerged(platform, limit);
    
    // Cache the raw data (always cache the largest set we fetched)
    await cacheSet(platform, rawData);

    const response: TopResponse = {
      fetched_at: new Date().toISOString(),
      items: normalizeTop(platform, rawData).slice(0, limit)
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