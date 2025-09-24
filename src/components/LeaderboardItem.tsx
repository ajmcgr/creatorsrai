import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { useInViewAvatarEnrichment } from "@/hooks/useInViewAvatarEnrichment";
import diamondIcon from "@/assets/diamond-icon.png";

type Platform = 'youtube' | 'tiktok' | 'instagram';

type TopItem = {
  rank: number;
  id: string;
  displayName: string;
  username?: string;
  avatar?: string;
  followers: number;
  platform: Platform;
};

const PLATFORM_CONFIG = {
  youtube: { 
    name: "YouTube", 
    color: "bg-red-500", 
    metric: "subscribers" 
  },
  instagram: { 
    name: "Instagram", 
    color: "bg-pink-500", 
    metric: "followers" 
  },
  tiktok: { 
    name: "TikTok", 
    color: "bg-black", 
    metric: "followers" 
  }
};

interface LeaderboardItemProps {
  entry: TopItem;
  index: number;
}

export function LeaderboardItem({ entry, index }: LeaderboardItemProps) {
  const isCritical = index < 12;
  const { item: enrichedEntry, loading: avatarLoading, elementRef } = useInViewAvatarEnrichment(entry, entry.platform, { initialInView: isCritical });
  const config = PLATFORM_CONFIG[enrichedEntry.platform];

  // Helper function to generate platform URL
  const getPlatformUrl = (username: string, platform: Platform): string => {
    const baseUrls = {
      youtube: 'https://www.youtube.com',
      instagram: 'https://www.instagram.com',
      tiktok: 'https://www.tiktok.com'
    };
    
    // Handle username format - some might already have @, some might not
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    switch (platform) {
      case 'youtube':
        return `${baseUrls.youtube}/@${cleanUsername}`;
      case 'instagram':
        return `${baseUrls.instagram}/${cleanUsername}`;
      case 'tiktok':
        return `${baseUrls.tiktok}/@${cleanUsername}`;
      default:
        return '#';
    }
  };

  return (
    <Card 
      ref={elementRef}
      key={`${enrichedEntry.platform}-${String(enrichedEntry.id)}`}
      className="p-1.5 sm:p-2 bg-white border border-gray-200 hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
          {/* Rank */}
          <div className="flex-shrink-0 w-5 sm:w-6 text-center">
            <span className="text-sm sm:text-lg font-bold text-gray-500">
              {enrichedEntry.rank}
            </span>
          </div>

          {/* Avatar */}
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarImage 
              src={enrichedEntry.avatar}
              alt={enrichedEntry.displayName}
              loading={isCritical ? "eager" : "lazy"}
              decoding="async"
              // @ts-ignore - fetchPriority is not in older TS DOM types but supported by browsers
              fetchPriority={isCritical ? "high" : "low"}
              sizes="48px"
              className={avatarLoading && !enrichedEntry.avatar ? 'opacity-50' : ''}
            />
            <AvatarFallback className={`bg-white ${avatarLoading && !enrichedEntry.avatar ? 'animate-pulse' : ''}`}>
              <img 
                src={diamondIcon} 
                alt="Placeholder avatar"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <a 
              href={getPlatformUrl(enrichedEntry.username || '', enrichedEntry.platform)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm sm:text-lg truncate text-gray-900 hover:text-primary transition-colors duration-200 block"
            >
              {enrichedEntry.displayName}
            </a>
            {enrichedEntry.username && (
              <div className="text-xs sm:text-sm text-gray-500 truncate">
                @{enrichedEntry.username.startsWith('@') ? enrichedEntry.username.slice(1) : enrichedEntry.username}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="text-right space-y-1 flex-shrink-0">
          <div className="font-bold text-sm sm:text-xl text-gray-900">
            {formatNumber(enrichedEntry.followers)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {config?.metric || 'followers'}
          </div>
        </div>
      </div>
    </Card>
  );
}