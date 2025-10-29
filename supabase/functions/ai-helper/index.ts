import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let prompt = "";
    let systemPrompt = "You are a professional content creator helping other creators craft compelling media kits.";

    switch (type) {
      case "polish_bio":
        prompt = `Polish this creator bio to be more professional and engaging for brands. Keep it under 200 characters:\n\n"${data.bio}"`;
        break;

      case "audience_summary":
        systemPrompt = "You are a warm, personable content creator introducing yourself to potential brand partners. Write in first person, be positive and genuine.";
        prompt = `Write a first-person introduction (2-3 sentences max) for my media kit. My platforms: ${data.platforms || "social media"}.

DO NOT mention follower counts or engagement rates. Instead, focus on:
- Who I am as a creator and my personality
- What kind of content I create
- The authentic community I've built
- My unique voice and creative perspective

Be warm, positive, genuine, and engaging. This should feel like a friendly introduction, not a stats sheet. Start naturally, like "I'm a creator who..." or "I love creating content that...". Keep it conversational and authentic.`;
        break;

      case "suggest_rates":
        const followers = parseInt(data.followers || "0");
        const engagement = parseFloat(data.engagement_rate || "0");
        prompt = `As a creator pricing expert, suggest fair collaboration rates based on:
- Followers: ${followers}
- Engagement Rate: ${engagement}%
- Niche: ${data.niche || "general"}

Return ONLY a JSON object with these exact fields (no markdown, no extra text):
{
  "single_post": number,
  "story_package": number,
  "full_campaign": "Custom"
}`;
        break;

      case "suggest_theme":
        prompt = `Based on this creator's niche and platform focus, suggest the best design theme (minimal, editorial, or creator_pop):
- Platform: ${data.platform || "Instagram"}
- Content Type: ${data.content_type || "lifestyle"}
- Audience: ${data.audience || "Gen Z"}

Respond with ONLY ONE WORD: minimal, editorial, or creator_pop`;
        break;

      default:
        throw new Error(`Unknown type: ${type}`);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiData = await response.json();
    console.log("OpenAI response:", JSON.stringify(aiData, null, 2));

    const result = aiData.choices?.[0]?.message?.content;

    if (!result) {
      console.error("No content in AI response. Full response:", JSON.stringify(aiData));
      throw new Error(`No response from AI. Response structure: ${JSON.stringify(aiData)}`);
    }

    // For suggest_rates, parse the JSON response
    if (type === "suggest_rates") {
      try {
        const parsed = JSON.parse(result);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        console.error("Failed to parse AI rates response:", result);
        // Fallback to calculated rates
        const followers = parseInt(data.followers || "0");
        return new Response(JSON.stringify({
          single_post: Math.round(followers * 0.08),
          story_package: Math.round(followers * 0.05),
          full_campaign: "Custom"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ result: result.trim() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-helper:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
