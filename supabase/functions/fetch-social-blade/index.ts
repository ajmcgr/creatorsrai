import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGIN = "https://creatorsmediakit.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
  "Cache-Control": "no-store",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface RequestBody {
  platform: "youtube" | "tiktok" | "instagram";
  handle: string;
  forceRefresh?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) throw new Error("User not authenticated");

    // Parse and validate body
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { platform, handle, forceRefresh } = body;

    if (!platform || !["youtube", "tiktok", "instagram"].includes(platform)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'platform'. Must be youtube, tiktok, or instagram." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!handle || typeof handle !== "string" || handle.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'handle'. Must be a non-empty string." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const cleanHandle = handle.trim().toLowerCase();
    const cacheKey = `${platform}:${cleanHandle}`;

    // Check cache unless forceRefresh
    if (!forceRefresh) {
      const { data: cached } = await supabaseClient
        .from("social_stats_cache")
        .select("*")
        .eq("cache_key", cacheKey)
        .maybeSingle();

      if (cached) {
        const age = Date.now() - new Date(cached.updated_at).getTime();
        if (age < SEVEN_DAYS_MS) {
          console.log(`Cache hit for ${cacheKey}, age: ${Math.round(age / 1000 / 60)} minutes`);
          return new Response(
            JSON.stringify({ source: "cache", data: cached.payload }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      }
    }

    // Fetch from SocialBlade
    const apiKey = Deno.env.get("SOCIALBLADE_API_KEY");
    const apiHost = Deno.env.get("SOCIALBLADE_HOST") || "socialblade.p.rapidapi.com";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "SocialBlade API key not configured. Contact support." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Endpoint map
    const endpointMap: Record<string, string> = {
      youtube: `https://${apiHost}/youtube/channel/${cleanHandle}`,
      tiktok: `https://${apiHost}/tiktok/user/${cleanHandle}`,
      instagram: `https://${apiHost}/instagram/user/${cleanHandle}`,
    };

    const endpoint = endpointMap[platform];

    console.log(`Fetching ${platform} stats for ${cleanHandle} from ${endpoint}`);

    const upstreamResponse = await fetch(endpoint, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
        "Accept": "application/json",
      },
    });

    // Normalize upstream errors
    if (!upstreamResponse.ok) {
      const status = upstreamResponse.status;
      let reason = "Unknown error";
      let upstreamBody = "";

      try {
        const text = await upstreamResponse.text();
        upstreamBody = text.substring(0, 300);
        const json = JSON.parse(text);
        reason = json.message || json.error || reason;
      } catch {
        // not JSON
      }

      if (status === 401 || status === 403) {
        reason = "Invalid API key or plan not authorized";
      } else if (status === 404) {
        reason = "Handle not found";
      } else if (status === 429) {
        reason = "Rate limit / credits exceeded";
      } else if (status === 400) {
        reason = "Bad request to upstream (check endpoint/params)";
      }

      console.error(`Upstream error ${status} for ${platform}/${cleanHandle}: ${reason}`, upstreamBody);

      return new Response(
        JSON.stringify({ error: "Upstream API error", reason, status, upstreamBody }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    const payload = await upstreamResponse.json();

    // Upsert cache
    await supabaseClient
      .from("social_stats_cache")
      .upsert({ cache_key: cacheKey, payload, updated_at: new Date().toISOString() }, { onConflict: "cache_key" });

    console.log(`Cached fresh data for ${cacheKey}`);

    return new Response(
      JSON.stringify({ source: "live", data: payload }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in fetch-social-blade function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
