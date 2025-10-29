import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Known price IDs mapping to plans (keep in sync with your Stripe dashboard)
const PRICE_TO_PLAN: Record<string, "pro" | "business"> = {
  "price_1SIusePqUyKf3lND0kBVnz9M": "pro",
  "price_1SIy2TPqUyKf3lNDywiAOzGS": "business",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Two clients: one to read auth from JWT (anon) and one to write (service role)
  const supabaseAnon = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { auth: { persistSession: false } }
  );
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabaseAnon.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User email not available");

    // Look up Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return new Response(
        JSON.stringify({ success: false, message: "No Stripe customer found for this email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Find an active subscription
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 10 });
    const activeSub = subs.data.find((s: Stripe.Subscription) => ["active", "trialing", "past_due"].includes(s.status as string));

    if (!activeSub) {
      return new Response(
        JSON.stringify({ success: false, message: "No active subscription found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Determine plan from subscription items' price
    const priceId = activeSub.items.data[0]?.price?.id;
    const plan = (priceId && PRICE_TO_PLAN[priceId]) || "pro"; // default to pro

    // Update profile plan
    await supabaseService
      .from("profiles")
      .upsert({ user_id: user.id, plan, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    // Mark all user's kits as paid
    await supabaseService
      .from("media_kits")
      .update({ paid: true })
      .eq("user_id", user.id)
      .eq("paid", false);

    return new Response(
      JSON.stringify({ success: true, plan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("sync-stripe-status error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
