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
  if (!stats) return undefined;
  
  console.log('Stats object keys:', Object.keys(stats));
  
  // Try various possible avatar field names from Social Blade API
  const possibleFields = [
    'avatar',
    'profile_picture', 
    'profilePic',
    'profilepic',
    'thumbnail',
    'image',
    'icon',
    'picture',
    'photo',
    'profile_image',
    'profileImage',
    'avatarUrl',
    'avatar_url',
    // YouTube specific
    'snippet.thumbnails.default.url',
    'snippet.thumbnails.medium.url', 
    'snippet.thumbnails.high.url',
    // Generic nested paths
    'thumbnails.default.url',
    'thumbnails.medium.url',
    'thumbnails.high.url'
  ];
  
  for (const field of possibleFields) {
    let value = stats;
    const parts = field.split('.');
    
    for (const part of parts) {
      value = value?.[part];
      if (!value) break;
    }
    
    if (typeof value === 'string' && value.length > 0) {
      console.log(`Found avatar in field '${field}':`, value);
      return value;
    }
  }
  
  // Log the full stats object for debugging if no avatar found
  console.log('No avatar found. Full stats object:', JSON.stringify(stats, null, 2));
  return undefined;
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
        // Try both the ID and username if available
        const attempts = [id];
        const username = usernames[id];
        if (username && username !== id) {
          attempts.push(username);
        }
        
        let stats = null;
        let avatar = undefined;
        
        for (const query of attempts) {
          try {
            console.log(`Trying to fetch stats for ${platform}/${query}...`);
            stats = await fetchSbStats(platform, query);
            avatar = extractAvatar(stats);
            if (avatar) {
              console.log(`Found avatar using query '${query}': ${avatar}`);
              break;
            }
          } catch (queryError) {
            console.log(`Failed to fetch with query '${query}':`, queryError.message);
            continue;
          }
        }
        
        const displayName = displayNames[id];
        
        await setAvatarCache(supabase, platform, id, avatar, displayName, username);
        
        if (avatar) {
          result[id] = { avatar };
        }
        
        console.log(`Enriched avatar for ${platform}/${id}: ${avatar ? 'found' : 'not found'}`);
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
        
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