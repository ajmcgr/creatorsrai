import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';

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
  
  return await res.json();
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
      throw error;
    } else {
      console.log(`Successfully cached data for ${platform}`);
    }
  } catch (err) {
    console.error(`Error caching data for ${platform}:`, err);
    throw err;
  }
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
    // Check authorization
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const adminSecret = Deno.env.get('ADMIN_REFRESH_SECRET');
    
    if (!adminSecret || token !== adminSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram'];
    const refreshed: string[] = [];
    const errors: string[] = [];

    // Refresh all platforms
    for (const platform of PLATFORMS) {
      try {
        console.log(`Refreshing ${platform}...`);
        const raw = await fetchSbTop(platform);
        await setCachedData(supabase, platform, raw);
        refreshed.push(platform);
        console.log(`Successfully refreshed ${platform}`);
      } catch (error) {
        console.error(`Failed to refresh ${platform}:`, error);
        errors.push(`${platform}: ${error.message}`);
      }
    }

    const response = {
      refreshed,
      errors: errors.length > 0 ? errors : undefined,
      fetched_at: new Date().toISOString()
    };

    console.log('Refresh complete:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in admin-refresh-all function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});