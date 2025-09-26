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

function generateEmailHtml(newCreatorsMap: Record<string, any[]>, weekStart: string): string {
  const hasNewCreators = Object.values(newCreatorsMap).some(creators => creators?.length > 0);
  
  const platformSections = PLATFORMS.map(platform => {
    const creators = newCreatorsMap[platform] || [];
    const rows = createTableRows(platform, creators);
    
    return `
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
          ${platform}
        </h3>
        ${rows ? `
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
        ` : `
          <p style="color: #666; font-style: italic; margin: 0;">No new creators this week for ${platform}.</p>
        `}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Creators This Week</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Inter, system-ui, -apple-system, sans-serif;">
      <div style="max-width: 720px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
            🚀 New Creators This Week
          </h1>
          <p style="margin: 0; color: #666; font-size: 16px;">
            Week starting ${weekStart}
          </p>
        </div>
        
        ${hasNewCreators ? platformSections : `
          <div style="text-align: center; padding: 40px 0;">
            <p style="font-size: 18px; color: #666; margin: 0;">
              No new creators entered the Top 100 this week across any platform.
            </p>
            <p style="font-size: 14px; color: #999; margin: 16px 0 0 0;">
              Check back next week for updates!
            </p>
          </div>
        `}
        
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;">
        
        <div style="text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            You're receiving this because you subscribed at 
            <a href="https://creators200.com" style="color: #666; text-decoration: none;">creators200.com</a>
          </p>
          <p style="color: #999; font-size: 12px; margin: 8px 0 0 0;">
            Stay tuned for unsubscribe options in future updates.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(recipients: string[], subject: string, html: string): Promise<void> {
  if (!recipients.length) return;
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Creators 200 <updates@creators200.com>',
      to: recipients,
      subject,
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

    // Get subscriber emails
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email');
    
    const recipients = (subscribers || [])
      .map((sub: any) => sub.email)
      .filter(Boolean);
    
    console.log(`Found ${recipients.length} subscribers`);

    // Send email if there are subscribers
    if (recipients.length > 0) {
      const subject = `New Creators This Week — ${weekStart}`;
      const html = generateEmailHtml(newCreatorsMap, weekStart);
      
      await sendEmail(recipients, subject, html);
      console.log(`Email sent to ${recipients.length} subscribers`);
    }

    const newCounts = Object.fromEntries(
      PLATFORMS.map(p => [p, newCreatorsMap[p]?.length || 0])
    );

    return new Response(
      JSON.stringify({
        ok: true,
        week: weekStart,
        sent: recipients.length,
        newCounts
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