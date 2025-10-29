import { supabase } from "@/integrations/supabase/client";

export interface GatedSocialResponse {
  ok: true;
  source: "live_first_fetch";
  platform: string;
  query: string;
  data: any;
}

export interface GatedSocialError {
  ok: false;
  error_code: string;
  platform?: string;
  status?: number;
  reason?: string;
  snippet?: string;
  error?: string;
  details?: string;
}

export async function fetchSocialGated(
  mediaKitId: string,
  platform: "youtube" | "tiktok" | "instagram",
  handle: string,
  forceRefresh = false
): Promise<GatedSocialResponse> {
  const { data, error } = await supabase.functions.invoke("fetch-social-blade-gated", {
    body: { platform, handle },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch social data");
  }

  // Check if the response indicates an error (ok: false)
  if (data && !data.ok) {
    const errData = data as GatedSocialError;
    const reason = errData.reason || errData.error || errData.error_code || "Unknown error";
    throw new Error(reason);
  }

  if (!data || !data.ok) {
    throw new Error("Invalid response from Social Blade API");
  }

  return data as GatedSocialResponse;
}
