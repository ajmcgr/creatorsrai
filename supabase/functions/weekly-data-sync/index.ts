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
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

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

// Generate Social Blade API URL
function sbTopUrl(platform: string, page: number): string {
  const query = platform === 'youtube' ? 'subscribers' : 'followers';
  return `${SB_BASE_URL}/${platform}/top?query=${query}&page=${page}`;
}

// Fetch top 200 data for a platform (merge page 1 + page 2)
async function fetchTop(platform: string): Promise<any[]> {
  console.log(`Fetching ${platform} Top-200 from Social Blade...`);
  
  // Fetch page 1
  const r1 = await fetch(sbTopUrl(platform, 1), {
    headers: {
      clientid: SB_CLIENT_ID,
      token: SB_TOKEN
    }
  });
  
  if (!r1.ok) {
    console.error(`Social Blade ${platform} page 1 failed: ${r1.status}`);
    const errorText = await r1.text();
    console.error(`Error details: ${errorText}`);
    throw new Error(`Social Blade API error for ${platform} page 1: ${r1.status}`);
  }
  
  const json1 = await r1.json();
  
  // Fetch page 2
  const r2 = await fetch(sbTopUrl(platform, 2), {
    headers: {
      clientid: SB_CLIENT_ID,
      token: SB_TOKEN
    }
  });
  
  if (!r2.ok) {
    console.error(`Social Blade ${platform} page 2 failed: ${r2.status}`);
    const errorText = await r2.text();
    console.error(`Error details: ${errorText}`);
    throw new Error(`Social Blade API error for ${platform} page 2: ${r2.status}`);
  }
  
  const json2 = await r2.json();
  
  // Handle both array responses and {data: [...]} responses
  const arr1 = Array.isArray(json1) ? json1 : (json1?.data || []);
  const arr2 = Array.isArray(json2) ? json2 : (json2?.data || []);
  const merged = arr1.concat(arr2).slice(0, 200);
  
  console.log(`Fetched ${platform}: ${arr1.length} + ${arr2.length} = ${merged.length} items`);
  
  return merged;
}

function idOf(platform: string, item: any): string {
  return item.id || item.userid || item.username || item.channelid || `${platform}-${crypto.randomUUID()}`;
}

function diffNew(platform: string, previous: any[], current: any[]): any[] {
  // Ensure both are arrays
  if (!Array.isArray(previous)) previous = [];
  if (!Array.isArray(current)) current = [];
  
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

async function generateDataEmail(newCreatorsMap: Record<string, any[]>, weekStart: string): Promise<string> {
  const hasNewCreators = Object.values(newCreatorsMap).some(creators => creators?.length > 0);
  
  if (!hasNewCreators) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Weekly Creator Data - ${weekStart}</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: Inter, system-ui, -apple-system, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px;">
          <h1 style="color: #1a1a1a; margin-bottom: 16px;">Weekly Creator Data - ${weekStart}</h1>
          <p style="color: #666; font-size: 16px;">
            No new creators entered the Top 200 this week across any platform.
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            This data is ready for your Beehiiv newsletter.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  const platformSections = PLATFORMS.map(platform => {
    const creators = newCreatorsMap[platform] || [];
    const count = creators.length;
    
    if (count === 0) {
      return `
        <div style="margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
            ${platform} (${count} new creators)
          </h3>
          <p style="color: #666; font-style: italic; margin: 0;">No new creators this week.</p>
        </div>
      `;
    }

    const rows = createTableRows(platform, creators);
    
    return `
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
          ${platform} (${count} new creators)
        </h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: center; font-weight: 600; color: #666; border-bottom: 2px solid #e0e0e0;">#</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; border-bottom: 2px solid #e0e0e0;">Platform</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; border-bottom: 2px solid #e0e0e0;">Name</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #666; border-bottom: 2px solid #e0e0e0;">Handle</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #666; border-bottom: 2px solid #e0e0e0;">Audience</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Weekly Creator Data - ${weekStart}</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: Inter, system-ui, -apple-system, sans-serif;">
      <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px;">
        <h1 style="color: #1a1a1a; margin-bottom: 8px;">🚀 Weekly Creator Data</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 32px;">
          Week starting ${weekStart} • Ready for your Beehiiv newsletter
        </p>
        
        ${platformSections}
        
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;">
        
        <p style="color: #999; font-size: 12px; margin: 0;">
          This data was automatically generated from the weekly ranking sync.
        </p>
      </div>
    </body>
    </html>
  `;
}

async function sendDataEmail(html: string, weekStart: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Creators 200 Data <alex@creators200.com>',
      to: ['alex@creators200.com'],
      subject: `Weekly Creator Data - ${weekStart}`,
      html
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error ${response.status}: ${errorText}`);
  }
}

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
    const fetchErrors: string[] = [];
    
    for (const platform of PLATFORMS) {
      console.log(`Fetching current data for ${platform}...`);
      try {
        currentData[platform] = await fetchTop(platform);
        console.log(`Fetched ${currentData[platform]?.length || 0} items for ${platform}`);
        
        if (!currentData[platform] || currentData[platform].length === 0) {
          fetchErrors.push(`${platform}: No data returned from Social Blade API`);
        }
      } catch (error) {
        console.error(`Failed to fetch ${platform}:`, error);
        currentData[platform] = [];
        fetchErrors.push(`${platform}: ${error.message}`);
      }
    }
    
    // If all platforms failed, return error
    if (fetchErrors.length === PLATFORMS.length) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'All Social Blade API calls failed',
          details: fetchErrors,
          message: 'Please check Social Blade API credentials (SB_CLIENT_ID, SB_TOKEN) and API limits'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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

    // Send data email to alex@creators200.com for manual newsletter creation
    try {
      const dataEmail = await generateDataEmail(newCreatorsMap, weekStart);
      await sendDataEmail(dataEmail, weekStart);
      console.log('Data email sent to alex@creators200.com');
    } catch (emailError) {
      console.error('Failed to send data email:', emailError);
      // Don't fail the whole function if email fails
    }

    const newCounts = Object.fromEntries(
      PLATFORMS.map(p => [p, newCreatorsMap[p]?.length || 0])
    );

    return new Response(
      JSON.stringify({
        ok: true,
        week: weekStart,
        subscribers: subscriberCount,
        newCounts,
        message: "Data synced successfully. Data email sent to alex@creators200.com for manual Beehiiv newsletter."
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