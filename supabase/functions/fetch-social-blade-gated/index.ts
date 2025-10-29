import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

type Platform = "youtube" | "tiktok" | "instagram";
const ORIGIN = "https://creatorsmediakit.com";

function corsHeaders() {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", ORIGIN);
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "content-type, authorization, apikey, x-client-info");
  h.set("Cache-Control", "no-store");
  return h;
}
function ok(body: unknown) {
  const h = corsHeaders();
  h.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status: 200, headers: h });
}

function baseUrl() {
  return (Deno.env.get("SB_BASE_URL") ?? "https://matrix.sbapis.com/b").replace(/\/$/, "");
}
function sbUrl(base: string, p: Platform, query: string) {
  const u = new URL(base);
  if (p === "youtube")   u.pathname += "/youtube/statistics";
  if (p === "tiktok")    u.pathname += "/tiktok/statistics";
  if (p === "instagram") u.pathname += "/instagram/statistics";
  u.searchParams.set("query", query);
  return u.toString();
}

// Normalize input to expected query
function normalizeQuery(platform: Platform, input: string) {
  let s = (input || "").trim();
  // reduce URLs to last path segment
  try {
    const u = new URL(s);
    const seg = u.pathname.split("/").filter(Boolean);
    s = seg.pop() || s;
  } catch {}
  if (platform === "youtube") {
    if (/^UC[0-9A-Za-z_-]{20,}$/.test(s)) return s; // channel ID
    return s.startsWith("@") ? s : `@${s}`;         // @handle
  }
  // TikTok/IG = plain username
  return s.replace(/^@/, "");
}

// Resolve YouTube @handle → channelId with YouTube Data API v3
async function resolveYouTubeChannelId(handleOrQuery: string): Promise<string | null> {
  const key = Deno.env.get("YOUTUBE_API_KEY");
  if (!key) return null;
  const h = handleOrQuery.startsWith("@") ? handleOrQuery.slice(1) : handleOrQuery;

  // Prefer forHandle
  let url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(h)}&key=${key}`;
  let r = await fetch(url);
  if (r.ok) {
    const j = await r.json();
    if (j?.items?.[0]?.id) return j.items[0].id as string;
  }
  // Fallback to search
  url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(h)}&maxResults=1&key=${key}`;
  r = await fetch(url);
  if (r.ok) {
    const j = await r.json();
    const id = j?.items?.[0]?.id?.channelId;
    if (id) return id as string;
  }
  return null;
}

// Resolve TikTok canonical username by following redirects
async function canonicalizeTikTokUsername(raw: string): Promise<string | null> {
  const guess = raw.replace(/^@/, "");
  const probe = `https://www.tiktok.com/@${encodeURIComponent(guess)}`;
  const r = await fetch(probe, { redirect: "follow" }).catch(() => null);
  if (!r) return null;
  // The final URL may be something like https://www.tiktok.com/@canonical_name
  try {
    const final = new URL(r.url);
    const seg = final.pathname.split("/").filter(Boolean);
    const last = seg.pop() || "";
    if (last.startsWith("@")) return last.slice(1);
    return last || guess;
  } catch {
    return guess;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
  if (req.method !== "POST")    return ok({ ok: false, error_code: "METHOD_NOT_ALLOWED" });

  try {
    const { platform, handle } = await req.json() as { platform?: string; handle?: string };
    if (!platform || !handle) return ok({ ok: false, error_code: "MISSING_PARAMS" });

    const p = String(platform).toLowerCase() as Platform;
    if (!["youtube","tiktok","instagram"].includes(p)) {
      return ok({ ok: false, error_code: "INVALID_PLATFORM" });
    }

    const CID = Deno.env.get("SB_CLIENT_ID");
    const TOKEN = Deno.env.get("SB_TOKEN");
    if (!CID || !TOKEN) return ok({ ok: false, error_code: "SERVER_CONFIG_MISSING" });

    const BASE = baseUrl();

    // First attempt with normalized query
    let query = normalizeQuery(p, handle);
    let url   = sbUrl(BASE, p, query);

    console.log(`[SocialBlade] Fetching ${p} stats for query="${query}" from ${url}`);

    async function callSB(u: string) {
      const r = await fetch(u, { headers: { clientid: CID!, token: TOKEN!, Accept: "application/json" } });
      const text = await r.text();
      let json: any = null; try { json = JSON.parse(text); } catch {}
      return { ok: r.ok, status: r.status, text, json };
    }

    let res = await callSB(url);

    // If Not Found (commonly 404/502 from SB), try one smart retry per platform
    if (!res.ok && (res.status === 404 || res.status === 502)) {
      if (p === "youtube" && !/^UC[0-9A-Za-z_-]{20,}$/.test(query)) {
        console.log(`[SocialBlade] YouTube 404/502 - attempting channelId resolution for ${query}`);
        const chId = await resolveYouTubeChannelId(query);
        if (chId) {
          console.log(`[SocialBlade] Resolved to channelId: ${chId}`);
          query = chId;
          url = sbUrl(BASE, p, query);
          res = await callSB(url);
        }
      } else if (p === "tiktok") {
        console.log(`[SocialBlade] TikTok 404/502 - attempting canonical username resolution for ${query}`);
        const canon = await canonicalizeTikTokUsername(query);
        if (canon && canon !== query) {
          console.log(`[SocialBlade] Resolved to canonical: ${canon}`);
          query = canon;
          url = sbUrl(BASE, p, query);
          res = await callSB(url);
        }
      }
    }

    if (!res.ok) {
      console.error(`[SocialBlade] Error ${res.status} for ${p}/${query}:`, res.text.slice(0, 200));
      return ok({
        ok: false,
        platform: p,
        error_code: res.status === 404 ? "HANDLE_NOT_FOUND" : (res.status === 502 ? "SB_UPSTREAM_502" : "SB_ERROR"),
        status: res.status,
        query_attempted: query,
        snippet: res.text.slice(0, 300),
      });
    }

    // Some SB payloads include a status object — honor if present
    const sbSuccess = res.json?.status?.success === true || res.json?.status === true || res.json?.success === true || res.json?.data;
    if (!sbSuccess) {
      console.error(`[SocialBlade] SB status=false for ${p}/${query}:`, res.json);
      return ok({
        ok: false,
        platform: p,
        error_code: "SB_STATUS_FALSE",
        status: res.json?.status?.status ?? 200,
        error: res.json?.status?.error ?? res.json?.error ?? "Unknown SB error",
        query_attempted: query,
      });
    }

    console.log(`[SocialBlade] Success for ${p}/${query}`);
    return ok({ ok: true, source: "live_first_fetch", platform: p, query, data: res.json ?? res.text });

  } catch (e) {
    console.error("[SocialBlade] Unhandled exception:", e);
    return ok({ ok: false, error_code: "UNHANDLED_EXCEPTION", details: String(e) });
  }
});
