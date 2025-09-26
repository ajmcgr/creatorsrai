import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const BEEHIIV_API_KEY = Deno.env.get('BEEHIIV_API_KEY');
const BEEHIIV_PUB_ID = "da8703cc-12dd-47ad-bdb7-ddaf29333bf9";

async function addToBeehiiv(email: string): Promise<boolean> {
  if (!BEEHIIV_API_KEY) {
    console.error('Beehiiv API key not configured - this is required for newsletter subscriptions');
    return false;
  }

  console.log(`Attempting to add ${email} to Beehiiv publication ${BEEHIIV_PUB_ID}`);

  try {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'creators200.com'
      })
    });

    const responseText = await response.text();
    console.log(`Beehiiv API response for ${email}:`, {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    if (response.ok) {
      console.log(`Successfully added ${email} to Beehiiv`);
      return true;
    } else {
      console.error(`Beehiiv API error for ${email}:`, response.status, responseText);
      return false;
    }
  } catch (error) {
    console.error(`Error adding ${email} to Beehiiv:`, error);
    return false;
  }
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
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
    const { email } = await req.json();
    
    if (!email || !validEmail(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid email address' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Received subscription request for: ${email}`);
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Store in Supabase as backup
    const { error } = await supabase
      .from('subscribers')
      .upsert({ email });

    if (error) {
      console.error('Supabase storage error:', error);
      // Continue anyway - Beehiiv is the primary target
    } else {
      console.log(`Successfully stored ${email} in Supabase`);
    }

    // Add to Beehiiv (this is the main goal)
    const beehiivSuccess = await addToBeehiiv(email);
    if (!beehiivSuccess) {
      console.error(`Failed to add ${email} to Beehiiv - this is the primary failure`);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to subscribe to newsletter. Please try again.' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Successfully subscribed ${email} to Beehiiv newsletter`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Successfully subscribed to newsletter!',
        synced_to_beehiiv: beehiivSuccess 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Subscribe function error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});