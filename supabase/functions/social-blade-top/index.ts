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
  const pickString = (...vals: any[]): string | undefined => {
    for (const v of vals) {
      if (typeof v === 'string' && v.trim()) return v;
      if (v && typeof v === 'object') {
        const inner = (v.id ?? v.value ?? v.$id);
        if (typeof inner === 'string' && inner.trim()) return inner;
      }
    }
    return undefined;
  };

  const src = Array.isArray(raw) ? raw : (raw?.data || []);
  return src.map((it: any, i: number) => {
    const id = pickString(
      it.id, it.userid, it.user_id, it.channelid, it.channelId, it.channel_id,
      it.username, it.handle
    ) || `${platform}-${i}`;

    const displayName = pickString(
      it.displayname, it.display_name, it.title, it.name, it.fullname,
      it.channelname, it.channel_name, it.username, it.handle
    ) || 'Unknown';

    const username = pickString(
      it.username, it.handle, it.user?.username, it.account?.handle
    );

    const avatar = pickString(
      it.avatar, it.profile_picture, it.profilePic, it.thumbnail, it.image,
      it.picture, it.profile_image_url, it.profile?.avatar, it.user?.avatar
    );

    const followers = platform === 'youtube'
      ? Number(it.subscribers ?? it.subscriberCount ?? it.subs ?? it.followers ?? 0)
      : Number(it.followers ?? it.followerCount ?? it.fans ?? it.subscribers ?? 0);

    return { rank: i + 1, id, displayName, username, avatar, followers, platform };
  });
}

// Cache helpers with simplified logic
const CACHE_TTL_HOURS = Number(Deno.env.get('CACHE_TTL_HOURS') || '168'); // 7 days default
const DEFAULT_LIMIT = Number(Deno.env.get('TOP_LIMIT') || '200'); // Default 200 as requested

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
    .eq('page', 1) // Use page 1 as primary cache key
    .maybeSingle();
    
  if (!data) return null;
  
  const ageHours = (Date.now() - new Date(data.fetched_at).getTime()) / (1000 * 60 * 60);
  if (ageHours > CACHE_TTL_HOURS) return null;
  
  return data;
}

async function cacheSet(platform: Platform, rawData: any) {
  const client = supa();
  if (!client) return;
  
  try {
    await client.from('top_cache').upsert({
      platform,
      page: 1,
      week_start: new Date().toISOString().split('T')[0], // Today's date
      metric: platform === 'youtube' ? 'subscribers' : 'followers',
      data_json: rawData,
      fetched_at: new Date().toISOString()
    });
    console.log(`Cached ${platform} data successfully`);
  } catch (err) {
    console.error(`Failed to cache ${platform} data:`, err);
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
    const bypassCache = url.searchParams.get('bypassCache') === '1';
    const limitParam = url.searchParams.get('limit');
    const lim = limitParam ? Number(limitParam) : DEFAULT_LIMIT;
    const limit = lim >= 200 ? 200 : 100;
    
    const ALLOWED_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram'];
    if (!ALLOWED_PLATFORMS.includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'invalid platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`API request: ${platform} (limit: ${limit}, bypassCache: ${bypassCache})`);

    // Try cache unless bypassed
    if (!bypassCache) {
      const cached = await cacheGet(platform);
      if (cached?.data_json) {
        const arr = Array.isArray(cached.data_json) 
          ? cached.data_json 
          : (cached.data_json?.data || []);
        
        // Use cache if it has enough data for the requested limit
        if (arr?.length && ((limit === 100 && arr.length >= 100) || (limit === 200 && arr.length >= 200))) {
          console.log(`Cache hit for ${platform}, returning ${Math.min(limit, arr.length)} items`);
          const items = normalizeTop(platform, arr).slice(0, limit);
          return new Response(
            JSON.stringify({ fetched_at: cached.fetched_at, items }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Live fetch (page=1 [+ page=2 if limit=200]). Log upstream failures.
    console.log(`Cache miss for ${platform}, fetching live data...`);
    
    try {
      const rawData = await fetchTopMerged(platform, limit);
      await cacheSet(platform, rawData); // best-effort caching
      const items = normalizeTop(platform, rawData).slice(0, limit);
      
      return new Response(
        JSON.stringify({ fetched_at: new Date().toISOString(), items }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError: any) {
      console.error('SB_FETCH_FAIL', { platform, limit, error: fetchError?.message });
      return new Response(
        JSON.stringify({ 
          error: 'upstream-failed', 
          detail: fetchError?.message || 'Social Blade API error' 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error in social-blade-top function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        detail: error.message || 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});