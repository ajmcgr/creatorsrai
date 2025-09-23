import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';

function sbStatsUrl(platform: Platform, query: string): string {
  const SB_BASE = Deno.env.get('SB_BASE_URL') || 'https://matrix.sbapis.com/b';
  return `${SB_BASE}/${platform}/statistics?query=${encodeURIComponent(query)}`;
}

async function fetchSbStats(platform: Platform, query: string): Promise<any> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID');
  const SB_TOKEN = Deno.env.get('SB_TOKEN');
  
  if (!SB_CLIENT_ID || !SB_TOKEN) {
    throw new Error('Social Blade credentials not configured');
  }

  console.log(`Fetching ${platform} stats for ${query}...`);
  
  const res = await fetch(sbStatsUrl(platform, query), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`SocialBlade stats ${platform} ${res.status}: ${text}`);
    throw new Error(`SocialBlade stats ${platform} ${res.status}: ${text}`);
  }
  
  return await res.json();
}

function extractAvatar(stats: any): string | undefined {
  const c = stats || {};
  return (
    c.avatar ||
    c.profile_picture ||
    c.profilePic ||
    c.thumbnail ||
    c.image ||
    undefined
  );
}

async function getAvatarFromCache(supabase: any, platform: Platform, personId: string): Promise<any> {
  const { data } = await supabase
    .from('avatars_cache')
    .select('avatar_url, display_name, username, fetched_at')
    .eq('platform', platform)
    .eq('person_id', personId)
    .maybeSingle();
    
  if (!data) return null;
  
  // Check if cache is still valid (30 days)
  const ageDays = (Date.now() - new Date(data.fetched_at).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays > 30) return null; // stale
  
  return data;
}

async function setAvatarCache(
  supabase: any,
  platform: Platform,
  personId: string,
  avatarUrl?: string,
  displayName?: string,
  username?: string
): Promise<void> {
  await supabase.from('avatars_cache').upsert({
    platform,
    person_id: personId,
    avatar_url: avatarUrl || null,
    display_name: displayName || null,
    username: username || null,
    fetched_at: new Date().toISOString()
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const platform = body.platform as Platform;
    const ids = (body.ids || []).slice(0, 20); // Safety limit of 20
    const displayNames = body.displayNames || {};
    const usernames = body.usernames || {};

    const result: Record<string, { avatar?: string }> = {};

    // 1) Try cache first
    const toFetch: string[] = [];
    for (const id of ids) {
      try {
        const cached = await getAvatarFromCache(supabase, platform, id);
        if (cached?.avatar_url) {
          result[id] = { avatar: cached.avatar_url };
        } else {
          toFetch.push(id);
        }
      } catch (error) {
        console.error(`Error checking cache for ${id}:`, error);
        toFetch.push(id);
      }
    }

    // 2) Fetch missing from Social Blade statistics
    for (const id of toFetch) {
      try {
        const stats = await fetchSbStats(platform, id);
        const avatar = extractAvatar(stats);
        const displayName = displayNames[id];
        const username = usernames[id];
        
        await setAvatarCache(supabase, platform, id, avatar, displayName, username);
        
        if (avatar) {
          result[id] = { avatar };
        }
        
        console.log(`Enriched avatar for ${platform}/${id}: ${avatar ? 'found' : 'not found'}`);
      } catch (error) {
        console.error(`Error fetching avatar for ${id}:`, error);
        // Cache the miss to avoid repeated API calls
        await setAvatarCache(supabase, platform, id, undefined, displayNames[id], usernames[id]);
      }
    }

    return new Response(
      JSON.stringify({ avatars: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in avatar-enrichment function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});