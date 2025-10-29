import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map of plans to Stripe Price IDs
const PRICE_IDS = {
  pro: "price_1SIusePqUyKf3lND0kBVnz9M", // $19/month recurring
  business: "price_1SIy2TPqUyKf3lNDywiAOzGS", // $49/month recurring
} as const;

type PlanKey = keyof typeof PRICE_IDS;

const logStep = (step: string, details?: unknown) => {
  try {
    const extra = details ? ` ${JSON.stringify(details)}` : "";
    console.log(`[CREATE-PAYMENT] ${step}${extra}`);
  } catch {
    console.log(`[CREATE-PAYMENT] ${step}`);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use anon key – we only need to validate the JWT and read the user
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Start");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse incoming plan
    const body = await req.json().catch(() => ({ plan: "pro" }));
    const plan: PlanKey = (body?.plan ?? "pro") in PRICE_IDS ? body.plan : "pro";
    const priceId = PRICE_IDS[plan];
    logStep("Plan parsed", { plan, priceId });

    // Determine origin dynamically so it works in preview and production
    const origin = req.headers.get("origin") || "https://trycreators.ai";
    logStep("Origin determined", { origin });

    // Find existing Stripe customer by email (do not create here – Stripe can use customer_email)
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const existingCustomerId = customers.data[0]?.id;
    logStep("Customer lookup", { found: Boolean(existingCustomerId) });

    const session = await stripe.checkout.sessions.create({
      customer: existingCustomerId,
      customer_email: existingCustomerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
