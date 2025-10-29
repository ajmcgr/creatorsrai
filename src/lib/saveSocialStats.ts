import { supabase } from "@/integrations/supabase/client";
import type { SocialBundle } from "@/types/social";

export async function saveSocialStats(kitId: string, bundle: SocialBundle) {
  console.log(`[Save] kit ${kitId}`, bundle);

  // Calculate aggregates
  const platforms = Object.values(bundle).filter(Boolean);
  const totalFollowers = platforms.reduce((sum, p) => sum + (p?.followers || 0), 0);
  const engagementRates = platforms
    .map(p => p?.engagement_rate)
    .filter((r): r is number => r !== null && r !== undefined);
  const avgEngagement: number | null = engagementRates.length > 0
    ? engagementRates.reduce((sum, r) => sum + r, 0) / engagementRates.length
    : null;

  // Extract avatar from first available platform
  const avatarUrl = bundle.instagram?.avatar_url ||
                   bundle.youtube?.avatar_url ||
                   bundle.tiktok?.avatar_url ||
                   null;

  const { data, error } = await supabase
    .from('media_kits')
    .update({
      social_stats: bundle as any,
      followers_total: totalFollowers,
      avg_engagement_rate: avgEngagement,
      avatar_url: avatarUrl,
      last_data_refresh: new Date().toISOString(),
    })
    .eq('id', kitId)
    .select('id, social_stats, followers_total, avg_engagement_rate')
    .single();

  if (error) {
    console.error('[saveSocialStats] Error:', error);
    throw error;
  }

  console.log('[Save] Success - kit', data?.id, 'social_stats persisted');
  return data;
}
