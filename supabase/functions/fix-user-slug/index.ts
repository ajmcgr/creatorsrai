import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find the user by email
    const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    if (userError) throw userError;

    const targetUser = users.users.find(u => u.email === "business@hypeworkspod.com");
    
    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Find their media kit
    const { data: kits, error: kitError } = await supabaseClient
      .from("media_kits")
      .select("*")
      .eq("user_id", targetUser.id);

    if (kitError) throw kitError;

    if (!kits || kits.length === 0) {
      return new Response(
        JSON.stringify({ error: "No media kits found for this user" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Update the slug for all their kits (or just the first one)
    const kit = kits[0];
    
    const { error: updateError } = await supabaseClient
      .from("media_kits")
      .update({ public_url_slug: "hypeworks" })
      .eq("id", kit.id);

    if (updateError) throw updateError;

    console.log(`Updated kit ${kit.id} with slug "hypeworks"`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated kit ${kit.id} with public URL: https://trycreators.ai/hypeworks`,
        kit_id: kit.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});