import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, username } = await req.json();
    
    if (!platform || !username) {
      return new Response(
        JSON.stringify({ error: "Platform and username are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get("SOCIAL_BLADE_CLIENT_ID");
    const token = Deno.env.get("SOCIAL_BLADE_TOKEN");

    if (!clientId || !token) {
      console.error("Social Blade credentials not configured");
      return new Response(
        JSON.stringify({ error: "Social Blade API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Social Blade API endpoint
    const apiUrl = `https://api.socialblade.com/v2/${platform}/${username}`;
    
    console.log(`Fetching Social Blade data for ${platform}/${username}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Client-Id": clientId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Social Blade API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch data from Social Blade",
          details: errorText,
          status: response.status 
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Social Blade data fetched successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in social-blade function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
