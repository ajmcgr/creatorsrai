import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SB_BASE_URL = Deno.env.get("SB_BASE_URL")!;
const SB_CLIENT_ID = Deno.env.get("SB_CLIENT_ID")!;
const SB_TOKEN = Deno.env.get("SB_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MOCK_SB = Deno.env.get("MOCK_SB") === "1";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const PLATFORMS = ["youtube", "tiktok", "instagram"] as const;

type Platform = typeof PLATFORMS[number];

// Generate Social Blade API URL
function sbTopUrl(platform: string, page: number): string {
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE_URL}/${platform}/top?query=${query}&page=${page}`;
}

// Fetch top 200 data for a platform (2 pages × 100 = 200)
async function fetchTop200(platform: Platform): Promise<any[]> {
  if (MOCK_SB) {
    console.log(`[MOCK] Skipping Social Blade fetch for ${platform}`);
    return [];
  }

  console.log(`Fetching ${platform} Top-200 from Social Blade...`);
  
  const pages = [1, 2];
  const results: any[] = [];
  
  for (const page of pages) {
    const url = sbTopUrl(platform, page);
    console.log(`Fetching ${platform} page ${page}...`);
    
    try {
      const response = await fetch(url, {
        headers: {
          clientid: SB_CLIENT_ID,
          token: SB_TOKEN
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Social Blade ${platform} page ${page} failed: ${response.status} - ${errorText}`);
        
        // Retry once with exponential backoff for 429/5xx
        if (response.status === 429 || response.status >= 500) {
          console.log(`Retrying ${platform} page ${page} after 2s...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const retry = await fetch(url, {
            headers: {
              clientid: SB_CLIENT_ID,
              token: SB_TOKEN
            }
          });
          
          if (!retry.ok) {
            throw new Error(`Retry failed: ${retry.status}`);
          }
          
          const retryJson = await retry.json();
          const retryData = Array.isArray(retryJson) ? retryJson : (retryJson?.data || []);
          results.push(...retryData);
          continue;
        }
        
        throw new Error(`API error ${response.status}: ${errorText}`);
      }
      
      const json = await response.json();
      const data = Array.isArray(json) ? json : (json?.data || []);
      results.push(...data);
      console.log(`Got ${data.length} items from ${platform} page ${page}`);
      
    } catch (error) {
      console.error(`Failed to fetch ${platform} page ${page}:`, error);
      throw error;
    }
  }
  
  return results.slice(0, 200);
}

// Map API response to normalized format
function normalizeItem(item: any, platform: Platform, rank: number) {
  const profileId = item.channel_id || item.userid || item.id || item.username || `unknown-${rank}`;
  const handle = item.username || item.handle || item.user || '';
  const displayName = item.name || item.title || item.displayname || handle;
  const audience = platform === 'youtube' ? (item.subscribers || 0) : (item.followers || 0);
  
  return {
    profile_id: String(profileId),
    handle: String(handle),
    display_name: String(displayName),
    rank,
    metrics: {
      audience,
      raw: item
    }
  };
}

// Compare current vs previous and find new entries
function findNewEntries(platform: Platform, current: any[], previous: any[]): any[] {
  const prevIds = new Set(previous.map(item => String(item.profile_id)));
  return current.filter(item => !prevIds.has(String(item.profile_id)));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== WEEKLY INGEST STARTED ===');
    const runAt = new Date();
    
    // Insert rollup record first
    const { data: rollup, error: rollupError } = await supabase
      .from('sb_rollups')
      .insert({ run_at: runAt.toISOString(), notes: 'Weekly ingest started' })
      .select()
      .single();
    
    if (rollupError) {
      throw new Error(`Failed to create rollup: ${rollupError.message}`);
    }
    
    console.log(`Rollup created: ${rollup.id}`);
    
    const summary: Record<string, any> = {};
    
    for (const platform of PLATFORMS) {
      console.log(`\n--- Processing ${platform} ---`);
      
      try {
        // Fetch current Top 200
        const rawItems = await fetchTop200(platform);
        const currentItems = rawItems.map((item, idx) => normalizeItem(item, platform, idx + 1));
        
        console.log(`Normalized ${currentItems.length} items for ${platform}`);
        
        // Check data quality - if > 80% missing names or 0 audience, skip
        const invalidCount = currentItems.filter(item => 
          !item.display_name || item.display_name === 'unknown' || 
          item.metrics.audience === 0
        ).length;
        
        const invalidPercent = (invalidCount / currentItems.length) * 100;
        
        if (invalidPercent > 80) {
          console.warn(`${platform}: ${invalidPercent.toFixed(1)}% invalid data - skipping to avoid false positives`);
          summary[platform] = { status: 'skipped', reason: 'high_invalid_data', invalid_percent: invalidPercent };
          continue;
        }
        
        // Save snapshot
        const { error: snapshotError } = await supabase
          .from('sb_snapshots')
          .insert({
            platform,
            run_at: runAt.toISOString(),
            items: currentItems
          });
        
        if (snapshotError) {
          throw new Error(`Failed to save snapshot: ${snapshotError.message}`);
        }
        
        console.log(`Snapshot saved for ${platform}`);
        
        // Get previous snapshot
        const { data: prevSnapshot } = await supabase
          .from('sb_snapshots')
          .select('items, run_at')
          .eq('platform', platform)
          .lt('run_at', runAt.toISOString())
          .order('run_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!prevSnapshot) {
          console.log(`${platform}: First snapshot (baseline) - no comparison`);
          summary[platform] = { status: 'baseline', count: currentItems.length };
          continue;
        }
        
        console.log(`Previous snapshot from: ${prevSnapshot.run_at}`);
        
        // Find new entries
        const newEntries = findNewEntries(platform, currentItems, prevSnapshot.items || []);
        
        console.log(`Found ${newEntries.length} new entries for ${platform}`);
        
        // Insert new entries
        if (newEntries.length > 0) {
          const records = newEntries.map(entry => ({
            platform,
            run_at: runAt.toISOString(),
            profile_id: entry.profile_id,
            handle: entry.handle,
            display_name: entry.display_name,
            rank: entry.rank,
            metrics: entry.metrics
          }));
          
          const { error: insertError } = await supabase
            .from('sb_new_entries')
            .insert(records);
          
          if (insertError) {
            throw new Error(`Failed to insert new entries: ${insertError.message}`);
          }
          
          console.log(`Inserted ${newEntries.length} new entries`);
        }
        
        summary[platform] = { 
          status: 'success', 
          total: currentItems.length, 
          new_count: newEntries.length 
        };
        
      } catch (error) {
        console.error(`Error processing ${platform}:`, error);
        summary[platform] = { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }
    
    // Update rollup with summary
    const totalNew = Object.values(summary)
      .filter((s: any) => s.status === 'success')
      .reduce((sum: number, s: any) => sum + (s.new_count || 0), 0);
    
    await supabase
      .from('sb_rollups')
      .update({ 
        notes: `Completed: ${JSON.stringify(summary)} - ${totalNew} total new entries` 
      })
      .eq('id', rollup.id);
    
    console.log('=== WEEKLY INGEST COMPLETED ===');
    
    return new Response(
      JSON.stringify({
        success: true,
        run_at: runAt.toISOString(),
        summary,
        total_new: totalNew
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Weekly ingest error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
