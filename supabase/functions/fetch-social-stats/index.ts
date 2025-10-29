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

    console.log(`Fetching social stats for ${platform}/${username}`);

    // Mock data for demonstration - replace with actual API calls
    const mockData = {
      platform,
      username,
      followers: Math.floor(Math.random() * 100000),
      engagement_rate: (Math.random() * 10).toFixed(2),
      posts: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 1000000),
    };

    console.log("Social stats fetched successfully");

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-social-stats function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
