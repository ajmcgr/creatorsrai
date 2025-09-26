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

async function addToBeehiiv(email: string): Promise<{ success: boolean; error?: string }> {
  if (!BEEHIIV_API_KEY) {
    const error = 'Beehiiv API key not configured - this is required for newsletter subscriptions';
    console.error(error);
    return { success: false, error };
  }

  console.log(`Attempting to add ${email} to Beehiiv publication ${BEEHIIV_PUB_ID}`);
  console.log(`Using API key: ${BEEHIIV_API_KEY.substring(0, 10)}...`);

  try {
    const requestBody = {
      email: email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'creators200.com'
    };
    
    console.log('Request body:', JSON.stringify(requestBody));
    
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log(`Beehiiv API response for ${email}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    });

    if (response.ok) {
      console.log(`✅ Successfully added ${email} to Beehiiv`);
      return { success: true };
    } else {
      const error = `Beehiiv API error: ${response.status} ${response.statusText} - ${responseText}`;
      console.error(error);
      return { success: false, error };
    }
  } catch (error) {
    const errorMessage = `Network error adding ${email} to Beehiiv: ${error}`;
    console.error(errorMessage);
    return { success: false, error: errorMessage };
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
    console.log('About to call Beehiiv API...');
    const beehiivResult = await addToBeehiiv(email);
    
    if (!beehiivResult.success) {
      console.error(`❌ Failed to add ${email} to Beehiiv:`, beehiivResult.error);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `Newsletter subscription failed: ${beehiivResult.error || 'Unknown error'}` 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ Successfully subscribed ${email} to Beehiiv newsletter`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Successfully subscribed to newsletter!',
        synced_to_beehiiv: beehiivResult.success 
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