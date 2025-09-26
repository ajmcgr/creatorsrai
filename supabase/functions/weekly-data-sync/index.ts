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
// Removed RESEND_API_KEY since we're not sending emails anymore

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const PLATFORMS = ["youtube", "tiktok", "instagram"] as const;

function weekStartUTC(d = new Date()): string {
  const day = d.getUTCDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function sbTopUrl(platform: string): string {
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE_URL}/${platform}/top?query=${query}&page=1`;
}

async function fetchTop(platform: string): Promise<any[]> {
  const response = await fetch(sbTopUrl(platform), {
    headers: {
      clientid: SB_CLIENT_ID,
      token: SB_TOKEN
    }
  });
  
  if (!response.ok) {
    throw new Error(`Social Blade API error for ${platform}: ${response.status}`);
  }
  
  return await response.json();
}

function idOf(platform: string, item: any): string {
  return item.id || item.userid || item.username || item.channelid || `${platform}-${crypto.randomUUID()}`;
}

function diffNew(platform: string, previous: any[], current: any[]): any[] {
  const prevSet = new Set(previous.map((x: any) => idOf(platform, x)));
  const newCreators = [];
  
  for (const item of current) {
    const id = idOf(platform, item);
    if (!prevSet.has(id)) {
      newCreators.push(item);
    }
  }
  
  return newCreators;
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatNumber(num: number): string {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(num);
}

function createTableRows(platform: string, creators: any[]): string {
  if (!creators?.length) return '';
  
  return creators.slice(0, 30).map((creator: any, index: number) => {
    const name = escapeHtml(creator.displayname || creator.title || creator.username || creator.channelname || 'Unknown');
    const handle = escapeHtml(creator.username || '');
    const audience = platform === 'youtube' ? (creator.subscribers ?? 0) : (creator.followers ?? 0);
    const formattedAudience = formatNumber(audience);
    
    return `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 8px; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; text-transform: capitalize;">${escapeHtml(platform)}</td>
        <td style="padding: 8px; font-weight: 500;">${name}</td>
        <td style="padding: 8px; color: #666;">${handle ? '@' + handle : ''}</td>
        <td style="padding: 8px; text-align: right; font-weight: 500;">${formattedAudience}</td>
      </tr>
    `;
  }).join('');
}

// Remove email-related functions since we're using Beehiiv manually
// async function generateEmailHtml(...) - removed
// async function sendEmail(...) - removed

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting weekly diff email process...');
    
    const weekStart = weekStartUTC();
    console.log(`Week start: ${weekStart}`);

    // Fetch current top lists from Social Blade
    const currentData: Record<string, any[]> = {};
    for (const platform of PLATFORMS) {
      console.log(`Fetching current data for ${platform}...`);
      currentData[platform] = await fetchTop(platform);
      console.log(`Fetched ${currentData[platform]?.length || 0} items for ${platform}`);
    }

    // Load previous snapshots for comparison
    const previousData: Record<string, any[]> = {};
    for (const platform of PLATFORMS) {
      const { data } = await supabase
        .from('top_snapshots')
        .select('data_json, week_start')
        .eq('platform', platform)
        .lt('week_start', weekStart)
        .order('week_start', { ascending: false })
        .limit(1);
      
      previousData[platform] = data?.[0]?.data_json || [];
      console.log(`Previous data for ${platform}: ${previousData[platform]?.length || 0} items`);
    }

    // Compute new creators
    const newCreatorsMap: Record<string, any[]> = {};
    for (const platform of PLATFORMS) {
      newCreatorsMap[platform] = diffNew(platform, previousData[platform], currentData[platform]);
      console.log(`New creators for ${platform}: ${newCreatorsMap[platform]?.length || 0}`);
    }

    // Save current data as snapshots
    for (const platform of PLATFORMS) {
      const { error } = await supabase
        .from('top_snapshots')
        .upsert({
          platform,
          week_start: weekStart,
          data_json: currentData[platform]
        });
      
      if (error) {
        console.error(`Error saving snapshot for ${platform}:`, error);
      } else {
        console.log(`Saved snapshot for ${platform}`);
      }
    }

    // Get subscriber count for logging purposes
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email');
    
    const subscriberCount = subscribers?.length || 0;
    console.log(`Found ${subscriberCount} subscribers (emails will be sent manually via Beehiiv)`);

    const newCounts = Object.fromEntries(
      PLATFORMS.map(p => [p, newCreatorsMap[p]?.length || 0])
    );

    return new Response(
      JSON.stringify({
        ok: true,
        week: weekStart,
        subscribers: subscriberCount,
        newCounts,
        message: "Data synced successfully. Emails will be sent manually via Beehiiv."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Weekly diff email error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});