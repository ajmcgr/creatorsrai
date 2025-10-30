export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin' | 'twitch' | 'snapchat' | 'pinterest' | 'threads' | 'spotify';

export interface SocialStats {
  platform: Platform;
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  views: number | null;
  engagement_rate: number | null;
  avg_likes: number | null;
  avg_comments: number | null;
}

export interface SocialBundle {
  instagram?: SocialStats;
  tiktok?: SocialStats;
  youtube?: SocialStats;
}

export interface SocialStatsResponse {
  ok: true;
  data: SocialStats;
  source: 'cache' | 'live';
}

export interface SocialStatsError {
  ok: false;
  error: string;
  reason?: string;
  platform?: string;
  identifier?: string;
}
