import { supabase } from "@/integrations/supabase/client";

type Platform = 'instagram' | 'tiktok' | 'youtube';

interface SuccessResponse {
  ok: true;
  data: {
    followers: number;
    engagement?: number;
    posts?: number;
  };
  source: string;
}

interface ErrorResponse {
  ok: false;
  error: string;
  reason?: string;
}

type FetchResponse = SuccessResponse | ErrorResponse;

export async function fetchSocialStats(
  platform: Platform,
  input: string,
  _kitId?: string,
  _options?: { forceLive?: boolean }
): Promise<FetchResponse> {
  try {
    // Clean the input - extract username from URL if provided
    const username = extractUsername(platform, input);
    
    // Call the fetch-social-stats edge function
    const { data, error } = await supabase.functions.invoke('fetch-social-stats', {
      body: { platform, identifier: username }
    });

    if (error) {
      return {
        ok: false,
        error: error.message || 'Failed to fetch stats'
      };
    }

    // Handle the response from fetch-social-stats
    if (!data || !data.ok) {
      return {
        ok: false,
        error: data?.error || 'HANDLE_NOT_FOUND',
        reason: data?.reason || 'No data returned from API'
      };
    }

    return {
      ok: true,
      data: {
        followers: data.data?.followers || 0,
        engagement: data.data?.engagement_rate,
        posts: data.data?.posts
      },
      source: 'Social Blade API'
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

function extractUsername(platform: Platform, input: string): string {
  // Remove @ if present
  let cleaned = input.trim().replace(/^@/, '');
  
  // If it's a URL, extract the username
  if (cleaned.includes('://') || cleaned.includes('www.')) {
    try {
      const url = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      if (platform === 'youtube') {
        // Handle YouTube URLs: /@handle, /user/username, /channel/ID
        if (pathParts[0] === 'user' || pathParts[0] === 'channel') {
          return pathParts[1] || '';
        }
        // @handle format
        return pathParts[0]?.replace(/^@/, '') || '';
      }
      
      // For Instagram and TikTok, username is typically the first path segment
      return pathParts[0]?.replace(/^@/, '') || '';
    } catch {
      // If URL parsing fails, return the cleaned input
      return cleaned;
    }
  }
  
  return cleaned;
}
