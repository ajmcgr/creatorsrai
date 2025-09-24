import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Camera, Video, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import diamondIcon from "@/assets/diamond-icon.png";

type Platform = 'youtube' | 'tiktok' | 'instagram';

interface EnhancedTopItem {
  rank: number;
  id: string;
  displayName: string;
  username?: string;
  avatar?: string;
  followers: number;
  platform: Platform;
  diffValue?: number;
  prevValue?: number;
  growthPercentage?: number;
}

const PLATFORM_CONFIG = {
  youtube: { 
    name: "YouTube", 
    icon: Play, 
    color: "bg-red-500", 
    metric: "subscribers" 
  },
  instagram: { 
    name: "Instagram", 
    icon: Camera, 
    color: "bg-pink-500", 
    metric: "followers" 
  },
  tiktok: { 
    name: "TikTok", 
    icon: Video, 
    color: "bg-black", 
    metric: "followers" 
  }
};

export function Leaderboard() {
  const [data, setData] = useState<EnhancedTopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination (Top-200 shown as 4 pages of 50)
  const pageSize = 50;
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedData = data.slice(start, start + pageSize);

  const fetchData = async (platform: Platform) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching enhanced ${platform} data with growth metrics...`);
      
      // Use Supabase to get enhanced data with delta calculations
      const { data: enhancedData, error: dbError } = await supabase
        .from('top_cache_latest_with_delta')
        .select('*')
        .eq('platform', platform)
        .eq('metric', PLATFORM_CONFIG[platform].metric)
        .order('current_value', { ascending: false })
        .limit(200);

      if (dbError) {
        console.error('Database query failed:', dbError);
        setError(`Failed to load ${platform} data: ${dbError.message}`);
        setData([]);
        setLastUpdated(null);
        return;
      }

      if (!enhancedData || enhancedData.length === 0) {
        setError(`No ${platform} data available - data may not have been refreshed yet`);
        setData([]);
        setLastUpdated(null);
        return;
      }

      // Transform the data to match EnhancedTopItem interface
      const transformedData: EnhancedTopItem[] = enhancedData.map((item, index) => {
        const diffValue = item.diff_value ? Number(item.diff_value) : undefined;
        const prevValue = item.prev_value ? Number(item.prev_value) : undefined;
        const currentValue = Number(item.current_value);
        
        let growthPercentage: number | undefined;
        if (diffValue !== undefined && prevValue && prevValue > 0) {
          growthPercentage = (diffValue / prevValue) * 100;
        }

        return {
          rank: index + 1,
          id: item.person_id || `unknown-${index}`,
          displayName: item.display_name || 'Unknown Creator',
          username: item.username || undefined,
          avatar: item.avatar || undefined,
          followers: currentValue,
          platform: platform,
          diffValue,
          prevValue,
          growthPercentage
        };
      });
      
      setData(transformedData);
      setLastUpdated(enhancedData[0]?.fetched_at || new Date().toISOString());
      setError(null);
      console.log(`Successfully fetched ${transformedData.length} enhanced items for ${platform}`);

    } catch (error) {
      console.error('Error fetching enhanced data:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load ${platform} data: ${message}`);
      setData([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedPlatform);
  }, [selectedPlatform]);

  const platforms: Platform[] = ['youtube', 'instagram', 'tiktok'];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return 'Recently';
  };

  const getPlatformUrl = (username: string, platform: Platform) => {
    if (!username) return '#';
    
    switch (platform) {
      case 'youtube':
        return `https://youtube.com/@${username}`;
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'tiktok':
        return `https://tiktok.com/@${username}`;
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Platform Filter Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Leaderboard Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="p-1.5 sm:p-2 bg-white border border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          
          return (
            <button
              key={platform}
              onClick={() => { setSelectedPlatform(platform); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedPlatform === platform
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {config.name}
            </button>
          );
        })}
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="text-sm text-muted-foreground mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span>Last updated: {formatTimeAgo(lastUpdated)}</span>
          <span className="text-xs">
            Showing {data.length} creators • Page {page} of {totalPages}
          </span>
        </div>
      )}

      {/* Enhanced Leaderboard */}
      <div className="space-y-3">
        {pagedData.map((entry, index) => {
          const config = PLATFORM_CONFIG[entry.platform];
          const Icon = config?.icon || Users;

          return (
            <Card 
              key={`${entry.platform}-${String(entry.id)}`}
              className="p-1.5 sm:p-2 bg-white border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-5 sm:w-6 text-center">
                    <span className="text-sm sm:text-lg font-bold text-gray-500">
                      {entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarImage 
                      src={entry.avatar}
                      alt={entry.displayName}
                      loading="lazy"
                      decoding="async"
                    />
                    <AvatarFallback className="bg-white">
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
                      href={getPlatformUrl(entry.username || '', entry.platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sm sm:text-lg truncate text-gray-900 hover:text-primary transition-colors duration-200"
                    >
                      {entry.displayName}
                    </a>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-0">
                      <Badge variant="secondary" className="text-xs w-fit">
                        <Icon className="w-3 h-3 mr-1" />
                        {config?.name || entry.platform}
                      </Badge>
                      {entry.username && (
                        <span className="text-xs sm:text-sm text-gray-500 truncate">
                          {entry.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats */}
                <div className="text-right space-y-1 flex-shrink-0">
                  <div className="font-bold text-sm sm:text-xl text-gray-900">
                    {formatNumber(entry.followers)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {config?.metric || 'followers'}
                  </div>
                  
                  {/* Growth Indicator */}
                  {entry.diffValue !== undefined && entry.diffValue !== 0 && (
                    <div className={`flex items-center justify-end gap-1 text-xs ${
                      entry.diffValue > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.diffValue > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{entry.diffValue > 0 ? '+' : ''}{formatNumber(entry.diffValue)}</span>
                      {entry.growthPercentage !== undefined && (
                        <span className="opacity-75">
                          ({entry.growthPercentage > 0 ? '+' : ''}{entry.growthPercentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* No Change Indicator */}
                  {entry.diffValue === 0 && (
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                      <Minus className="w-3 h-3" />
                      <span>No change</span>
                    </div>
                  )}
                  
                  {/* Previous Week Value */}
                  {entry.prevValue !== undefined && entry.prevValue !== entry.followers && (
                    <div className="text-xs text-gray-400">
                      Was: {formatNumber(entry.prevValue)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentPage > 1) setPage(currentPage - 1); 
                }} 
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === pageNum} 
                  onClick={(e) => { e.preventDefault(); setPage(pageNum); }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentPage < totalPages) setPage(currentPage + 1); 
                }} 
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card className="p-12 text-center bg-gradient-surface border-red-200">
          <div className="text-red-600">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">⚠️ {error}</h3>
            <p className="text-gray-600">
              Please try again later or select a different platform.
            </p>
          </div>
        </Card>
      )}

      {/* No data state (when no error) */}
      {data.length === 0 && !loading && !error && (
        <Card className="p-12 text-center bg-gradient-surface">
          <div className="text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p>Leaderboard data will appear here once the data is refreshed.</p>
          </div>
        </Card>
      )}

      {/* Subscription Form */}
      <div className="mt-12 pt-8 border-t border-border">
        <SubscriptionForm />
      </div>
    </div>
  );
}