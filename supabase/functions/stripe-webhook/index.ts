import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No signature provided');
      return new Response(JSON.stringify({ error: 'No signature' }), { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('No webhook secret configured');
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), { status: 500 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Webhook event type:', event.type);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      console.log('Payment completed for:', customerEmail);

      if (!customerEmail) {
        console.error('No customer email found');
        return new Response(JSON.stringify({ error: 'No email' }), { status: 400 });
      }

      // Find user by email
      const { data: authData } = await supabase.auth.admin.listUsers();
      const user = authData.users.find(u => u.email === customerEmail);

      if (!user) {
        console.error('User not found:', customerEmail);
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }

      // Determine plan from line items
      let plan = 'pro';
      if (session.amount_total && session.amount_total >= 4900) {
        plan = 'business';
      }

      console.log(`Upgrading user ${user.id} to ${plan} plan`);

      // Update user's plan
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Mark media kits as paid
      const { error: kitsError } = await supabase
        .from('media_kits')
        .update({ 
          paid: true,
          stripe_payment_intent_id: session.payment_intent as string
        })
        .eq('user_id', user.id)
        .eq('paid', false);

      if (kitsError) {
        console.error('Media kits update error:', kitsError);
      }

      // Generate slugs for newly paid kits
      const { data: unpaidKits } = await supabase
        .from('media_kits')
        .select('id')
        .eq('user_id', user.id)
        .is('slug', null);

      if (unpaidKits) {
        for (const kit of unpaidKits) {
          const { data: slug } = await supabase.rpc('generate_unique_slug');
          if (slug) {
            await supabase
              .from('media_kits')
              .update({ slug })
              .eq('id', kit.id);
          }
        }
      }

      console.log('User upgraded successfully');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Webhook error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
