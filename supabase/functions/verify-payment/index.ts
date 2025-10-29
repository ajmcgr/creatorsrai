import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (!customerEmail) {
        throw new Error("No customer email found");
      }

      // Find user by email
      const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
      if (userError) throw userError;

      const user = users.users.find(u => u.email === customerEmail);
      if (!user) {
        throw new Error("User not found");
      }

      // Update user's plan to 'pro' in profiles table
      await supabaseClient
        .from("profiles")
        .upsert(
          { user_id: user.id, plan: "pro", updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );

      // Update all unpaid media kits for this user
      const { data: kits, error: updateError } = await supabaseClient
        .from("media_kits")
        .update({
          paid: true,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("user_id", user.id)
        .eq("paid", false)
        .select();

      if (updateError) throw updateError;

      // Generate public slugs for newly paid kits
      for (const kit of (kits || [])) {
        if (!kit.public_url_slug && kit.name) {
          const slug = await supabaseClient.rpc("generate_unique_slug", {
            base_name: kit.name,
          });

          if (slug.data) {
            await supabaseClient
              .from("media_kits")
              .update({ public_url_slug: slug.data })
              .eq("id", kit.id);
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified and media kits unlocked"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment not completed"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
