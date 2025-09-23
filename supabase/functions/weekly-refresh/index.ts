import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Platform = 'youtube' | 'tiktok' | 'instagram';

// Configuration from environment
const SB_BASE = Deno.env.get('SB_BASE_URL') || 'https://matrix.sbapis.com/b';
const SB_CLIENT_ID = Deno.env.get('SB_CLIENT_ID')!;
const SB_TOKEN = Deno.env.get('SB_TOKEN')!;
const TOP_LIMIT = Number(Deno.env.get('TOP_LIMIT') || 100);

// Helper to get Monday UTC for a given date
function mondayUTC(d = new Date()) {
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

// Generate Social Blade API URL
function topUrl(platform: Platform, page: number) {
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE}/${platform}/top?query=${query}&page=${page}`;
}

// Fetch top data for a platform (merge page 1 + page 2 if needed)
async function fetchTop(platform: Platform) {
  console.log(`Fetching ${platform} data from Social Blade...`);
  
  // Always fetch page 1
  const r1 = await fetch(topUrl(platform, 1), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!r1.ok) {
    throw new Error(`SB ${platform} page 1 failed: ${r1.status}`);
  }
  
  const json1 = await r1.json();
  
  // If TOP_LIMIT <= 100, return page 1 only
  if (TOP_LIMIT <= 100) {
    const arr = Array.isArray(json1) ? json1 : (json1?.data || []);
    console.log(`Fetched ${platform} page 1: ${arr.length} items`);
    return arr;
  }
  
  // For TOP_LIMIT > 100, try to fetch page 2 as well
  console.log(`Fetching ${platform} page 2 for TOP_LIMIT=${TOP_LIMIT}...`);
  
  const r2 = await fetch(topUrl(platform, 2), {
    headers: { 
      clientid: SB_CLIENT_ID, 
      token: SB_TOKEN 
    }
  });
  
  if (!r2.ok) {
    throw new Error(`SB ${platform} page 2 failed: ${r2.status}`);
  }
  
  const json2 = await r2.json();
  const arr1 = Array.isArray(json1) ? json1 : (json1?.data || []);
  const arr2 = Array.isArray(json2) ? json2 : (json2?.data || []);
  const merged = arr1.concat(arr2);
  
  console.log(`Fetched ${platform}: ${arr1.length} + ${arr2.length} = ${merged.length} items`);
  return merged;
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
    console.log('Starting weekly refresh for all platforms...');
    
    const client = supa();
    if (!client) {
      throw new Error('Database client unavailable');
    }
    
    const weekStart = mondayUTC();
    const platforms: Platform[] = ['youtube', 'tiktok', 'instagram'];
    const results: Record<string, string> = {};
    
    for (const platform of platforms) {
      try {
        console.log(`Processing ${platform}...`);
        
        // Fetch data from Social Blade
        const dataArray = await fetchTop(platform);
        
        // Store in top_snapshots table
        const { error } = await client
          .from('top_snapshots')
          .upsert({
            platform,
            week_start: weekStart,
            limit_size: TOP_LIMIT >= 200 ? 200 : 100,
            data_json: dataArray,
            fetched_at: new Date().toISOString()
          });
        
        if (error) {
          throw new Error(`Database upsert failed: ${error.message}`);
        }
        
        results[platform] = 'ok';
        console.log(`Successfully refreshed ${platform} with ${dataArray.length} items`);
        
        // Polite rate limiting between platforms
        await new Promise(resolve => setTimeout(resolve, 250));
        
      } catch (error: any) {
        console.error(`Failed to refresh ${platform}:`, error);
        results[platform] = `skip: ${error?.message || error}`;
      }
    }
    
    console.log('Weekly refresh completed:', results);
    
    return new Response(
      JSON.stringify({ 
        week_start: weekStart,
        results,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in weekly-refresh function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'refresh_failed',
        detail: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});