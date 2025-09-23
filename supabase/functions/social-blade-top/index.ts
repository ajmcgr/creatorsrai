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

// Helper to get Monday UTC for a given date
function mondayUTC(d = new Date()) {
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
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
    const platform = (url.searchParams.get('platform') || 'youtube').toLowerCase() as Platform;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : Number(Deno.env.get('TOP_LIMIT') || 100);
    const lim = limit >= 200 ? 200 : 100;

    const allowedPlatforms = new Set(['youtube', 'tiktok', 'instagram']);
    if (!allowedPlatforms.has(platform)) {
      return new Response(
        JSON.stringify({ error: 'invalid platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Cache-only API request: ${platform} (limit: ${lim})`);

    const client = supa();
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'database_unavailable', items: [] }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const todayWeek = mondayUTC();
    
    // Try to get latest snapshot <= current week
    const { data, error } = await client
      .from('top_snapshots')
      .select('data_json, fetched_at, week_start, limit_size')
      .eq('platform', platform)
      .lte('week_start', todayWeek)
      .order('week_start', { ascending: false })
      .limit(1);

    if (data?.[0]?.data_json?.length) {
      const snapshot = data[0];
      const arr = Array.isArray(snapshot.data_json) ? snapshot.data_json : (snapshot.data_json?.data || []);
      const items = normalizeTop(platform, arr).slice(0, lim);
      
      console.log(`Cache hit for ${platform}, returning ${items.length} items from week ${snapshot.week_start}`);
      
      return new Response(
        JSON.stringify({
          fetched_at: snapshot.fetched_at,
          week_start: snapshot.week_start,
          limit_size: snapshot.limit_size,
          items
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to legacy cache (top_cache table) if no snapshot found
    console.log(`No snapshot found for ${platform}, trying legacy cache...`);
    
    const legacyResult = await client
      .from('top_cache')
      .select('data_json, fetched_at')
      .eq('platform', platform)
      .maybeSingle();

    if (legacyResult.data?.data_json?.length) {
      const arr = Array.isArray(legacyResult.data.data_json) 
        ? legacyResult.data.data_json 
        : (legacyResult.data.data_json?.data || []);
      const items = normalizeTop(platform, arr).slice(0, lim);
      
      console.log(`Legacy cache hit for ${platform}, returning ${items.length} items`);
      
      return new Response(
        JSON.stringify({
          fetched_at: legacyResult.data.fetched_at,
          week_start: todayWeek,
          limit_size: lim,
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