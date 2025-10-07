// supabase/functions/weekly-ingest/index.ts
// Safe + credit-efficient Social Blade weekly ingest

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SB_BASE_URL = Deno.env.get("SB_BASE_URL") ?? "https://api.socialblade.com";
const SB_CLIENT_ID = Deno.env.get("SB_CLIENT_ID")!;
const SB_TOKEN = Deno.env.get("SB_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// --- Safety switches ---
const MOCK_SB = Deno.env.get("MOCK_SB") === "1";
const DRY_RUN = Deno.env.get("DRY_RUN") === "1";

// --- Config ---
const PLATFORMS = ["youtube", "instagram", "tiktok"] as const;
const MAX_CALLS = 6;
let callsUsed = 0;

// Helper to build API URL
function sbTopUrl(platform: string, page: number) {
  const query = platform === "youtube" ? "subscribers" : "followers";
  return `${SB_BASE_URL}/${platform}/top?query=${query}&page=${page}`;
}

// Generic fetch with credit cap + retries
async function fetchJson(url: string, attempt = 1): Promise<any> {
  if (MOCK_SB) {
    console.log(`[MOCK] Would fetch: ${url}`);
    return { data: [] }; // empty placeholder
  }
  if (callsUsed >= MAX_CALLS) throw new Error("Credit cap hit (6/week)");
  callsUsed++;

  const res = await fetch(url, { headers: { clientid: SB_CLIENT_ID, token: SB_TOKEN } });
  if (!res.ok) {
    const txt = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      console.warn(`Retrying (${attempt}) ${url}...`);
      await new Promise((r) => setTimeout(r, 750 * attempt));
      return fetchJson(url, attempt + 1);
    }
    throw new Error(`Social Blade error ${res.status}: ${txt}`);
  }
  return res.json();
}

// Normalize payload
function asArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.data)) return x.data;
  return [];
}

// --- Main handler ---
Deno.serve(async () => {
  console.log("=== Weekly Ingest Start ===");
  console.log(`Mode → MOCK_SB=${MOCK_SB} | DRY_RUN=${DRY_RUN}`);

  try {
    const now = new Date();
    const perPlatform: Record<string, any[]> = {};

    for (const p of PLATFORMS) {
      console.log(`Fetching ${p}...`);
      const page1 = await fetchJson(sbTopUrl(p, 1));
      const page2 = await fetchJson(sbTopUrl(p, 2));
      const arr1 = asArray(page1);
      const arr2 = asArray(page2);
      const merged = arr1.concat(arr2).slice(0, 200);
      console.log(`${p}: fetched ${merged.length} items`);
      perPlatform[p] = merged;
    }

    if (DRY_RUN) {
      console.log("[DRY RUN] Not writing to database");
      console.log({ callsUsed, summary: Object.fromEntries(PLATFORMS.map((p) => [p, perPlatform[p].length])) });
      return new Response(JSON.stringify({ ok: true, dryRun: true, callsUsed }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Persist to Supabase ---
    const headers = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // Insert snapshots
    const snapRows = Object.entries(perPlatform).map(([platform, items]) => ({
      platform,
      run_at: now.toISOString(),
      items,
    }));

    const snapRes = await fetch(`${SUPABASE_URL}/rest/v1/sb_snapshots`, {
      method: "POST",
      headers,
      body: JSON.stringify(snapRows),
    });
    if (!snapRes.ok) throw new Error(`Snapshot insert failed: ${await snapRes.text()}`);

    console.log("Snapshots stored successfully.");
    console.log(`Total Social Blade calls used: ${callsUsed}`);

    return new Response(JSON.stringify({ ok: true, callsUsed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Ingest failed:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
});
