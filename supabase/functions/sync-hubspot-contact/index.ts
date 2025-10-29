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
    const { email, firstName, lastName, company } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hubspotToken = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!hubspotToken) {
      console.error("HubSpot access token not configured");
      return new Response(
        JSON.stringify({ error: "HubSpot integration not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Syncing contact to HubSpot:", email);

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hubspotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: firstName,
          lastname: lastName,
          company,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HubSpot API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to sync contact to HubSpot", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Contact synced successfully to HubSpot");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in sync-hubspot-contact function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
