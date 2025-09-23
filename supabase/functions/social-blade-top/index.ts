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
  week_start?: string;
  limit_size?: number;
  items: TopItem[];
}

// Helper to get first of month UTC for a given date
function firstOfMonthUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function monthKey(d = new Date()) {
  const m = firstOfMonthUTC(d);
  return m.toISOString().slice(0, 10);
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

  const toNumber = (v: any): number => {
    if (typeof v === 'number' && Number.isFinite(v)) return Math.floor(v);
    if (typeof v === 'string') {
      const cleaned = v.replace(/[,\s]/g, '');
      const n = parseInt(cleaned, 10);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const src = Array.isArray(raw) ? raw : (raw?.data || []);
  return src.map((it: any, i: number) => {
    // Handle nested Social Blade structure
    const idObj = it.id || {};
    const statsObj = it.statistics?.total || {};
    
    const id = pickString(
      idObj.id, idObj.userid, idObj.user_id, idObj.channelid,
      it.id, it.userid, it.user_id, it.channelid, it.channelId, it.channel_id,
      it.username, it.handle
    ) || `${platform}-${i}`;

    const displayName = pickString(
      idObj.display_name, idObj.displayname, idObj.displayName,
      idObj.title, idObj.channelTitle, idObj.channel_title,
      idObj.name, idObj.fullname, idObj.full_name,
      idObj.channelname, idObj.channel_name,
      idObj.username, idObj.handle,
      // Fallback to top-level props
      it.displayname, it.display_name, it.displayName,
      it.title, it.channelTitle, it.channel_title,
      it.name, it.fullname, it.full_name,
      it.channelname, it.channel_name,
      it.username, it.handle
    ) || id;

    const username = pickString(
      idObj.username, idObj.handle, idObj.customUrl, idObj.custom_url,
      it.username, it.handle, it.customUrl, it.custom_url,
      it.user?.username, it.account?.handle, it.screen_name
    );

    const avatar = pickString(
      idObj.avatar, idObj.profile_picture, idObj.profilePic, idObj.thumbnail, idObj.image,
      it.avatar, it.profile_picture, it.profilePic, it.thumbnail, it.image,
      it.picture, it.profile_image_url, it.profile?.avatar, it.user?.avatar
    );

    // Extract follower counts from nested structure
    const yt = toNumber(
      statsObj.subscribers ?? statsObj.subscriberCount ?? statsObj.subscriber_count ??
      it.subscribers ?? it.subscriberCount ?? it.subscriber_count ?? it.subs ?? it.subs_count ?? it['Subscribers']
    );
    
    const igtt = toNumber(
      statsObj.followers ?? statsObj.followerCount ?? statsObj.follower_count ??
      it.followers ?? it.followerCount ?? it.follower_count ?? it.fans ?? it['Followers']
    );

    const followers = platform === 'youtube' ? yt : igtt;

    return { rank: i + 1, id, displayName, username, avatar, followers, platform };
  });
}

function supa() {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Get parameters from both URL query params and request body
    let platform = (url.searchParams.get('platform') || 'youtube').toLowerCase() as Platform;
    let limitParam = url.searchParams.get('limit');
    
    // Also check request body for parameters (when called via supabase.functions.invoke)
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body.platform) platform = body.platform.toLowerCase();
        if (body.limit) limitParam = body.limit.toString();
      } catch (e) {
        // Ignore JSON parsing errors for GET requests
      }
    }
    
    const wanted = limitParam ? Number(limitParam) : 200;
    const limit = wanted >= 200 ? 200 : 100;

    const allowedPlatforms = new Set(['youtube', 'tiktok', 'instagram']);
    if (!allowedPlatforms.has(platform)) {
      return new Response(
        JSON.stringify({ error: 'invalid platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Cache-only API request: ${platform} (limit: ${limit})`);

    const client = supa();
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'database_unavailable', items: [] }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentMonth = monthKey();
    
    // Try to get latest snapshot <= current month
    const { data, error } = await client
      .from('top_snapshots')
      .select('data_json, fetched_at, week_start, limit_size')
      .eq('platform', platform)
      .lte('week_start', currentMonth)
      .order('week_start', { ascending: false })
      .limit(1);

    if (data?.[0]?.data_json?.length) {
      const snapshot = data[0];
      const arr = Array.isArray(snapshot.data_json) ? snapshot.data_json : (snapshot.data_json?.data || []);
      const items = normalizeTop(platform, arr).slice(0, limit);
      
      console.log(`Cache hit for ${platform}, returning ${items.length} items from month ${snapshot.week_start}`);
      
      return new Response(
        JSON.stringify({
          fetched_at: snapshot.fetched_at,
          period_start: snapshot.week_start, // month anchor
          limit_size: snapshot.limit_size,
          items
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to legacy cache (top_cache table) if no snapshot found
    console.log(`No snapshot found for ${platform}, trying legacy cache...`);
    
    const { data: legacyRows } = await client
      .from('top_cache')
      .select('data_json, fetched_at, page, week_start')
      .eq('platform', platform)
      .order('week_start', { ascending: false })
      .order('page', { ascending: true })
      .limit(2);

    if (legacyRows && legacyRows.length) {
      const arrays = legacyRows.map((row) => Array.isArray(row.data_json) ? row.data_json : (row.data_json?.data || []));
      const merged = arrays.flat();
      const items = normalizeTop(platform, merged).slice(0, limit);
      const latest = legacyRows[0];
      
      console.log(`Legacy cache hit for ${platform}, found ${legacyRows.length} page(s), returning ${items.length} items`);
      
      return new Response(
        JSON.stringify({
          fetched_at: latest.fetched_at,
          period_start: latest.week_start || currentMonth,
          limit_size: limit,
          items
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No data available
    console.log(`No cached data available for ${platform}`);
    return new Response(
      JSON.stringify({ 
        items: [], 
        error: 'no_snapshot',
        message: `No cached data available for ${platform}. Weekly refresh may not have run yet.`
      }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in social-blade-top function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'internal_error',
        items: [],
        detail: error.message || 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});