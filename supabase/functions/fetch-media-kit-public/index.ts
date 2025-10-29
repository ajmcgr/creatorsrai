// Public fetch for media kit by ID, only if the kit is published (has a non-null public_url_slug)
// Uses service role on the server to safely read and return limited fields

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kit_id } = await req.json().catch(() => ({}));
    if (!kit_id || typeof kit_id !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "Missing kit_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env variables");
      return new Response(JSON.stringify({ ok: false, error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("media_kits")
      .select(
        "id, name, bio, email, avatar_url, social_stats, social_data, followers_total, avg_engagement_rate, custom_rate, suggested_rates, ai_summary, ai_bio, paid, layout_style, custom_styles, public_url_slug"
      )
      .eq("id", kit_id)
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Only allow public kits
    if (!data.public_url_slug) {
      return new Response(JSON.stringify({ ok: false, error: "Not publicly available" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true, kit: data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
