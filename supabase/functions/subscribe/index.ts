import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    
    const { error } = await supabase
      .from('subscribers')
      .upsert({ email });

    if (error) {
      console.error('Subscription error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to subscribe. Please try again.' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Creators Leaderboard <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Creators Leaderboard Updates",
        html: `
          <h1>Welcome to Creators Leaderboard!</h1>
          <p>Thank you for subscribing to our weekly updates!</p>
          <p>You'll now receive weekly emails highlighting new creators who have entered the Top 200 across YouTube, TikTok, and Instagram.</p>
          <p>Stay tuned for exciting creator insights and trending metrics!</p>
          <br>
          <p>Best regards,<br>The Creators Leaderboard Team</p>
        `,
      });
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email fails
    }

    return new Response(
      JSON.stringify({ ok: true }), 
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