import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  platform: 'instagram' | 'tiktok' | 'youtube';
  identifier: string;
}

interface UnifiedPayload {
  platform: string;
  id: string;
  username: string;
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

/**
 * Resolve YouTube @handle or username to channelId using YouTube Data API v3
 */
async function resolveYouTubeChannelId(identifier: string, apiKey: string): Promise<string | null> {
  try {
    let url: string;

    if (identifier.startsWith('@')) {
      // Handle format: @username
      const handle = identifier.slice(1);
      url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
      console.info(`[YouTube API] Resolving @handle: ${handle}`);
    } else if (identifier.startsWith('UC')) {
      // Already a channel ID
      return identifier;
    } else {
      // Legacy username format
      url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(identifier)}&key=${apiKey}`;
      console.info(`[YouTube API] Resolving username: ${identifier}`);
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const channelId = data.items[0].id;
      console.info(`[YouTube API] Resolved to channelId: ${channelId}`);
      return channelId;
    }

    console.warn(`[YouTube API] No channel found for: ${identifier}`);
    return null;
  } catch (error) {
    console.error(`[YouTube API] Resolution failed:`, error);
    return null;
  }
}

/**
 * Validate identifier for Social Blade API
 */
function isValidIdentifier(identifier: string): boolean {
  // Allow alphanumeric, underscore, hyphen, and UC prefix for YouTube channel IDs
  return /^[a-zA-Z0-9_-]+$/.test(identifier);
}

/**
 * Map Social Blade response to unified payload
 */
/**
 * Avatar URL - return null, let client handle or use uploaded avatar
 */
function avatarFor(platform: string, username: string, channelId?: string | null): string | null {
  // No longer using unavatar - return null
  return null;
}

/**
 * Parse number safely - return null if invalid
 */
function parseNum(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : Number(val);
  return isNaN(num) ? null : num;
}

function mapSocialBladeResponse(platform: string, data: any, finalId: string, username: string): UnifiedPayload {
  if (platform === 'youtube') {
    const displayName = data.display_name || data.displayName || data.title || data.name || null;
    const channelId = finalId.startsWith('UC') ? finalId : null;

    return {
      platform: 'youtube',
      id: finalId,
      username: username,
      display_name: displayName,
      avatar_url: avatarFor('youtube', username, channelId),
      followers: parseNum(data.subscriber_count || data.subscriberCount || data.followers),
      following: null,
      posts: parseNum(data.video_count || data.videoCount || data.posts),
      views: parseNum(data.view_count || data.viewCount || data.views),
      engagement_rate: parseNum(data.engagement_rate || data.engagementRate),
      avg_likes: parseNum(data.avg_likes || data.avgLikes),
      avg_comments: parseNum(data.avg_comments || data.avgComments),
    };
  }

  if (platform === 'instagram') {
    const displayName = data.display_name || data.displayName || data.full_name || data.fullName || null;

    return {
      platform: 'instagram',
      id: finalId,
      username: username,
      display_name: displayName,
      avatar_url: avatarFor('instagram', username),
      followers: parseNum(data.follower_count || data.followerCount || data.followers),
      following: parseNum(data.following_count || data.followingCount || data.following),
      posts: parseNum(data.post_count || data.postCount || data.posts),
      views: null, // IG doesn't typically expose total views
      engagement_rate: parseNum(data.engagement_rate || data.engagementRate),
      avg_likes: parseNum(data.avg_likes || data.avgLikes),
      avg_comments: parseNum(data.avg_comments || data.avgComments),
    };
  }

  if (platform === 'tiktok') {
    const displayName = data.display_name || data.displayName || data.nickname || null;

    return {
      platform: 'tiktok',
      id: finalId,
      username: username,
      display_name: displayName,
      avatar_url: avatarFor('tiktok', username),
      followers: parseNum(data.follower_count || data.followerCount || data.followers),
      following: parseNum(data.following_count || data.followingCount || data.following),
      posts: parseNum(data.video_count || data.videoCount || data.posts),
      views: parseNum(data.view_count || data.viewCount || data.views),
      engagement_rate: parseNum(data.engagement_rate || data.engagementRate),
      avg_likes: parseNum(data.avg_likes || data.avgLikes),
      avg_comments: parseNum(data.avg_comments || data.avgComments),
    };
  }

  // Default fallback - all nulls
  return {
    platform,
    id: finalId,
    username: username,
    display_name: null,
    avatar_url: avatarFor(platform, username, finalId),
    followers: null,
    following: null,
    posts: null,
    views: null,
    engagement_rate: null,
    avg_likes: null,
    avg_comments: null,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, identifier }: RequestBody = await req.json();

    console.info(`[SocialStats] Request: platform=${platform}, identifier=${identifier}`);

    // Validate input
    if (!platform || !identifier) {
      return new Response(
        JSON.stringify({ ok: false, error: 'HANDLE_NOT_FOUND', reason: 'Missing platform or identifier' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let finalIdentifier = identifier;

    // Resolve YouTube handles to channel IDs if possible
    if (platform === 'youtube') {
      const ytApiKey = Deno.env.get('YOUTUBE_API_KEY');

      if (ytApiKey && !identifier.startsWith('UC')) {
        const channelId = await resolveYouTubeChannelId(identifier, ytApiKey);
        if (channelId) {
          finalIdentifier = channelId;
        } else {
          console.warn(`[YouTube] Could not resolve ${identifier}, using as-is`);
        }
      }
    }

    // Validate identifier format for Social Blade
    if (!isValidIdentifier(finalIdentifier)) {
      console.error(`[SocialStats] Invalid identifier format: ${finalIdentifier}`);
      return new Response(
        JSON.stringify({ ok: false, error: 'HANDLE_NOT_FOUND', reason: 'Invalid identifier format' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Social Blade API
    const sbClientId = Deno.env.get('SB_CLIENT_ID');
    const sbToken = Deno.env.get('SB_TOKEN');

    if (!sbClientId || !sbToken) {
      throw new Error('SB_CLIENT_ID or SB_TOKEN not configured');
    }

    const sbUrl = `https://matrix.sbapis.com/b/${platform}/statistics?query=${encodeURIComponent(finalIdentifier)}&clientid=${sbClientId}&token=${sbToken}`;
    console.info(`[SocialBlade] Fetching ${platform}:${finalIdentifier}`);

    const sbResponse = await fetch(sbUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const sbData = await sbResponse.json();

    // Handle Social Blade errors
    if (!sbResponse.ok || (sbData.status && !sbData.status.success)) {
      console.error(`[SocialBlade] Error ${sbResponse.status}:`, sbData);

      // Fallback: TikTok sometimes requires @handle
      if (sbResponse.status === 404 && platform === 'tiktok' && !finalIdentifier.startsWith('@')) {
        const altUrl = `https://matrix.sbapis.com/b/${platform}/statistics?query=${encodeURIComponent('@' + finalIdentifier)}&clientid=${sbClientId}&token=${sbToken}`;
        console.info(`[SocialBlade] TikTok 404 - retrying with @handle for ${finalIdentifier}`);
        const altRes = await fetch(altUrl, { headers: { 'Accept': 'application/json' } });
        const altData = await altRes.json();
        if (altRes.ok && (!altData.status || altData.status.success)) {
          const payload = mapSocialBladeResponse(platform, altData, finalIdentifier, identifier);
          return new Response(
            JSON.stringify({ ok: true, data: payload }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      const errMsg = sbData?.status?.error || 'Social Blade API error';
      if (sbResponse.status === 404) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'HANDLE_NOT_FOUND',
            reason: errMsg,
            platform,
            identifier: finalIdentifier,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          ok: false,
          error: 'UPSTREAM_ERROR',
          status: sbResponse.status,
          reason: errMsg,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map to unified payload
    const payload = mapSocialBladeResponse(platform, sbData, finalIdentifier, identifier);

    console.info(`[SocialStats] Success: ${payload.username} (${payload.followers} followers)`);

    return new Response(
      JSON.stringify({ ok: true, data: payload }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[SocialStats] Uncaught error:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'UNCAUGHT',
        reason: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
