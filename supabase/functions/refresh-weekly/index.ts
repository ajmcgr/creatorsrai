import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SB_BASE_URL = Deno.env.get("SB_BASE_URL") || "https://matrix.sbapis.com/b";
const SB_CLIENT_ID = Deno.env.get("SB_CLIENT_ID")!;
const SB_TOKEN = Deno.env.get("SB_TOKEN")!;

const PLATFORMS = ["youtube", "instagram", "tiktok", "twitch", "facebook"];
const PRIMARY_METRIC: Record<string,string> = {
  youtube: "subscribers",
  instagram: "followers", 
  tiktok: "followers",
  twitch: "followers",
  facebook: "followers"
};

function weekStartUTC(d = new Date()): string {
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() + diff);
  monday.setUTCHours(0,0,0,0);
  return monday.toISOString().slice(0,10);
}

serve(async () => {
  const week_start = weekStartUTC();
  const results: any[] = [];

  for (const platform of PLATFORMS) {
    const metric = PRIMARY_METRIC[platform];
    const url = `${SB_BASE_URL}/${platform}/top?query=${metric}&page=0`;

    try {
      const res = await fetch(url, {
        headers: { clientid: SB_CLIENT_ID, token: SB_TOKEN },
      });
      if (!res.ok) continue;
      const data = await res.json();

      // Fetch previous week's data
      const { data: prevRows } = await supabase
        .from("top_cache")
        .select("data_json")
        .eq("platform", platform)
        .eq("metric", metric)
        .eq("page", 0)
        .order("week_start", { ascending: false })
        .limit(1);

      let delta_json: Record<string, any> = {};
      if (prevRows && prevRows.length > 0) {
        const prev = prevRows[0].data_json;
        const prevMap: Record<string, any> = {};
        for (const p of prev) prevMap[p.id || p.username] = p;

        for (const curr of data) {
          const key = curr.id || curr.username;
          const prevEntry = prevMap[key];
          if (prevEntry) {
            const currVal = curr.subscribers || curr.followers || 0;
            const prevVal = prevEntry.subscribers || prevEntry.followers || 0;
            delta_json[key] = { current: currVal, prev: prevVal, diff: currVal - prevVal };
          }
        }
      }

      await supabase.from("top_cache").upsert({
        platform,
        metric,
        page: 0,
        week_start,
        data_json: data,
        delta_json,
        fetched_at: new Date().toISOString(),
      });

      results.push({ platform, metric, count: data?.length || 0 });
    } catch (error) {
      console.error(`Error processing ${platform}:`, error);
    }
  }

  return new Response(JSON.stringify({ week_start, refreshed: results }), {
    headers: { "Content-Type": "application/json" },
  });
});