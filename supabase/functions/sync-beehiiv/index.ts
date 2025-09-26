import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BEEHIIV_API_KEY = Deno.env.get("BEEHIIV_API_KEY")!;
const BEEHIIV_PUB_ID = "da8703cc-12dd-47ad-bdb7-ddaf29333bf9";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addToBeehiiv(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: false,
        send_welcome_email: false,
        utm_source: 'creators200.com'
      })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: `${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Beehiiv sync...');

    // Get all subscribers from database
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email');

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to fetch subscribers' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const results = {
      total: subscribers?.length || 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    console.log(`Found ${results.total} subscribers to sync`);

    // Process each subscriber
    for (const subscriber of subscribers || []) {
      const result = await addToBeehiiv(subscriber.email);
      
      if (result.success) {
        results.successful++;
        console.log(`✓ Synced: ${subscriber.email}`);
      } else {
        results.failed++;
        const errorMsg = `Failed to sync ${subscriber.email}: ${result.error}`;
        results.errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Sync complete: ${results.successful} successful, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        ok: true,
        message: `Sync complete: ${results.successful}/${results.total} subscribers synced to Beehiiv`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Sync function error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});