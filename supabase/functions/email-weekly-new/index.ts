import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Creators200 <weekly@creators200.com>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DRY_RUN = Deno.env.get("DRY_RUN") === "1";

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PLATFORMS = ["youtube", "instagram", "tiktok"] as const;
type Platform = typeof PLATFORMS[number];

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)} K`;
  return String(num);
}

function getPlatformUrl(platform: Platform, handle: string): string {
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  
  switch (platform) {
    case 'youtube':
      return `https://youtube.com/@${cleanHandle}`;
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`;
  }
}

function generateEmailHtml(entries: Record<Platform, any[]>, runAt: string): string {
  const platformSections = PLATFORMS.map(platform => {
    const creators = entries[platform] || [];
    
    if (creators.length === 0) {
      return `
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
            ${platform.toUpperCase()} — 0 new entrants
          </h2>
          <p style="color: #666; font-style: italic;">No new creators this week.</p>
        </div>
      `;
    }
    
    // Check data quality
    const invalidCount = creators.filter(c => 
      !c.display_name || c.display_name === 'unknown' || 
      !c.metrics?.audience || c.metrics.audience === 0
    ).length;
    
    const invalidPercent = (invalidCount / creators.length) * 100;
    
    if (invalidPercent > 70) {
      return `
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
            ${platform.toUpperCase()} — Data Quality Warning
          </h2>
          <p style="color: #e67e22; font-weight: 500;">
            ⚠️ ${invalidPercent.toFixed(0)}% of entries have missing/invalid data. Parsing may have failed.
          </p>
        </div>
      `;
    }
    
    const items = creators.map(creator => {
      const handle = creator.handle || 'unknown';
      const name = creator.display_name || handle;
      const rank = creator.rank || '?';
      const audience = creator.metrics?.audience || 0;
      const url = getPlatformUrl(platform, handle);
      
      return `
        <li style="margin-bottom: 8px;">
          <strong>#${rank}</strong> 
          <a href="${url}" target="_blank" style="color: #2754C5; text-decoration: none;">
            ${name}
          </a>
          ${handle !== 'unknown' ? ` — @${handle}` : ''}
          <span style="color: #666;">(${formatNumber(audience)})</span>
        </li>
      `;
    }).join('');
    
    return `
      <div style="margin-bottom: 32px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; text-transform: uppercase; color: #333;">
          ${platform.toUpperCase()} — ${creators.length} new entrant${creators.length === 1 ? '' : 's'}
        </h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${items}
        </ul>
      </div>
    `;
  }).join('');
  
  const totalNew = Object.values(entries).reduce((sum, arr) => sum + arr.length, 0);
  const date = new Date(runAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Monthly New Creators - ${date}</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: Inter, system-ui, -apple-system, sans-serif;">
      <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px;">
        <h1 style="color: #1a1a1a; margin-bottom: 8px;">🚀 Monthly New Top 200 Creators</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 32px;">
          ${date} • ${totalNew} new creator${totalNew === 1 ? '' : 's'} entered the Top 200
        </p>
        
        ${platformSections}
        
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;">
        
        <p style="color: #999; font-size: 12px; margin: 0;">
          This data was automatically generated by the monthly-ingest function.
          <br>Social Blade API credits used: 6 (2 pages × 3 platforms)
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to } = await req.json();
    const toEmail = to || "alex@creators200.com";
    
    console.log(`Generating weekly email for ${toEmail}...`);
    
    // Get latest rollup
    const { data: rollup, error: rollupError } = await supabase
      .from('sb_rollups')
      .select('run_at')
      .order('run_at', { ascending: false })
      .limit(1)
      .single();
    
    if (rollupError || !rollup) {
      throw new Error('No rollup data found - weekly-ingest may not have run yet');
    }
    
    const runAt = rollup.run_at;
    console.log(`Latest rollup: ${runAt}`);
    
    // Fetch new entries for this run
    const { data: newEntries, error: entriesError } = await supabase
      .from('sb_new_entries')
      .select('*')
      .eq('run_at', runAt)
      .order('platform')
      .order('rank');
    
    if (entriesError) {
      throw new Error(`Failed to fetch entries: ${entriesError.message}`);
    }
    
    console.log(`Found ${newEntries?.length || 0} new entries`);
    
    // Group by platform
    const entriesByPlatform: Record<Platform, any[]> = {
      youtube: [],
      instagram: [],
      tiktok: []
    };
    
    (newEntries || []).forEach(entry => {
      if (entry.platform in entriesByPlatform) {
        entriesByPlatform[entry.platform as Platform].push(entry);
      }
    });
    
    // Generate email
    const html = generateEmailHtml(entriesByPlatform, runAt);
    const totalNew = Object.values(entriesByPlatform).reduce((sum, arr) => sum + arr.length, 0);
    const date = new Date(runAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (DRY_RUN) {
      console.log('=== DRY RUN MODE ===');
      console.log('Email would be sent to:', toEmail);
      console.log('Subject:', `Monthly Top 200: ${totalNew} New Creators - ${date}`);
      console.log('HTML:', html);
      
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          to: toEmail,
          subject: `Monthly Top 200: ${totalNew} New Creators - ${date}`,
          html
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Send email via Resend
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `Monthly Top 200: ${totalNew} New Creators - ${date}`,
      html
    });
    
    if (sendError) {
      throw new Error(`Resend error: ${sendError.message}`);
    }
    
    console.log('Email sent successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        to: toEmail,
        total_new: totalNew,
        run_at: runAt
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Email weekly new error:', error);
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
