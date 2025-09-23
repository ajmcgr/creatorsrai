import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';

async function fetchFromSocialBladePage(platform: Platform, page: number): Promise<any[]> {
  const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID')!;
  const SB_TOKEN = Deno.env.get('SB_TOKEN')!;
  const SB_BASE_URL = Deno.env.get('SB_BASE_URL')!;

  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  const url = `${SB_BASE_URL}/${platform}/top?query=${query}&page=${page}`;
  
  console.log(`Fetching ${platform} data from Social Blade page ${page}: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'clientid': SB_CLIENT_ID,
      'token': SB_TOKEN,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Social Blade API error for ${platform} page ${page}:`, response.status, response.statusText);
    throw new Error(`SocialBlade error: ${response.status}`);
  }

  const data = await response.json();
  const dataArray = Array.isArray(data) ? data : (data?.data || []);
  console.log(`Successfully fetched ${platform} page ${page} data:`, dataArray.length, 'items');
  
  return dataArray;
}

async function fetchFromSocialBlade(platform: Platform): Promise<any[]> {
  console.log(`Fetching Top-200 for ${platform} by merging pages 1 & 2`);
  
  // Fetch both pages in parallel for Top-200
  const [page1Data, page2Data] = await Promise.all([
    fetchFromSocialBladePage(platform, 1),
    fetchFromSocialBladePage(platform, 2)
  ]);

  // Merge the results
  const merged = [...page1Data, ...page2Data];
  console.log(`Merged ${platform} data: ${page1Data.length} + ${page2Data.length} = ${merged.length} items`);
  
  return merged;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    const ADMIN_REFRESH_SECRET = Deno.env.get('ADMIN_REFRESH_SECRET')!;
    
    if (!authHeader || authHeader !== `Bearer ${ADMIN_REFRESH_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body for optional platform selection
    const body = await req.text();
    let requestedPlatforms: Platform[] = ['youtube', 'tiktok', 'instagram'];
    
    if (body) {
      try {
        const parsed = JSON.parse(body);
        if (parsed.platforms && Array.isArray(parsed.platforms)) {
          requestedPlatforms = parsed.platforms.filter((p: string) => 
            ['youtube', 'tiktok', 'instagram'].includes(p)
          );
        }
      } catch (e) {
        console.warn('Invalid JSON body, using default platforms');
      }
    }

    console.log('Refreshing platforms:', requestedPlatforms);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const refreshedPlatforms: Platform[] = [];
    const now = new Date().toISOString();

    // Refresh each requested platform
    for (const platform of requestedPlatforms) {
      try {
        console.log(`Refreshing ${platform}...`);
        const rawData = await fetchFromSocialBlade(platform);
        
        // Only cache if we got data
        if (rawData.length > 0) {
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
            console.error(`Cache upsert error for ${platform}:`, upsertError);
          } else {
            refreshedPlatforms.push(platform);
            console.log(`Successfully refreshed ${platform}`);
          }
        } else {
          console.warn(`No data returned for ${platform}, skipping cache update`);
        }
      } catch (error) {
        console.error(`Error refreshing ${platform}:`, error);
        // Continue with other platforms even if one fails
      }
    }

    return new Response(
      JSON.stringify({
        refreshed: refreshedPlatforms,
        fetched_at: now
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Admin refresh error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});