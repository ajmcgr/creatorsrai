import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Camera, Video, Users } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { useAvatarEnrichment } from "@/hooks/useAvatarEnrichment";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
type TopResponse = { 
  fetched_at: string; 
  week_start?: string;
  limit_size?: number;
  items: TopItem[];
  error?: string;
  message?: string;
};

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
  const [data, setData] = useState<TopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination (Top-200 shown as 4 pages of 50)
  const pageSize = 50;
  const total = data.length; // Use raw data length instead of enriched data
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedData = data.slice(start, start + pageSize);
  
  // Use avatar enrichment hook for progressive loading on the current page only
  const { items: enrichedPageData, loading: avatarLoading } = useAvatarEnrichment(pagedData, selectedPlatform);

  console.log(`Pagination: total=${total}, currentPage=${currentPage}, totalPages=${totalPages}`);
  console.log(`Data length: raw=${data.length}, enriched=${enrichedPageData.length}`);
  console.log('Raw data sample:', data.slice(0, 2)); // Debug: show first 2 items
  console.log('Enriched data sample:', enrichedPageData.slice(0, 2)); // Debug: show first 2 items

  const fetchData = async (platform: Platform) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching Top-200 ${platform} data from monthly cache...`);
      
      // Build URL with proper parameters - always use cache-only approach
      const params = new URLSearchParams({
        platform,
        limit: '200'
      });
      
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-blade-top?${params}`;
      const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${anon}`,
          'apikey': anon,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error === 'no_snapshot') {
            errorMessage = 'No cached data available - monthly refresh may not have run yet';
          } else {
            errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
          }
        } catch {
          const errText = await response.text().catch(() => '');
          if (errText) errorMessage = errText;
        }
        
        console.error('API request failed:', response.status, errorMessage);
        setError(`Failed to load ${platform} data: ${errorMessage}`);
        setData([]);
        setLastUpdated(null);
        return;
      }

      const result: TopResponse = await response.json();
      
      if (!result.items || result.items.length === 0) {
        if (result.error === 'no_snapshot') {
          setError(`No cached ${platform} data available - monthly refresh may not have run yet`);
        } else {
          setError(`No ${platform} data available at this time`);
        }
        setData([]);
        setLastUpdated(null);
        return;
      }
      
      setData(result.items);
      setLastUpdated(result.fetched_at);
      setError(null);
      console.log(`Successfully fetched ${result.items.length} cached items for ${platform}`);
      console.log('Sample data:', result.items.slice(0, 3)); // Debug: show first 3 items

    } catch (error) {
      console.error('Error fetching data:', error);
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
    setPage(1); // Reset to page 1 when switching platforms
  }, [selectedPlatform]);

  const platforms: Platform[] = ['youtube', 'instagram', 'tiktok'];

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

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
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

      {/* Ranking */}
      <div className="space-y-3">
        {enrichedPageData.map((entry, index) => {
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
                      // @ts-ignore - fetchPriority is not in older TS DOM types but supported by browsers
                      fetchPriority="low"
                      sizes="48px"
                      className={avatarLoading && !entry.avatar ? 'opacity-50' : ''}
                    />
                    <AvatarFallback className={`bg-white ${avatarLoading && !entry.avatar ? 'animate-pulse' : ''}`}>
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
                      className="font-semibold text-sm sm:text-lg truncate text-gray-900 hover:text-primary transition-colors duration-200 block"
                    >
                      {entry.displayName}
                    </a>
                    {entry.username && (
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        @{entry.username.startsWith('@') ? entry.username.slice(1) : entry.username}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right space-y-1 flex-shrink-0">
                  <div className="font-bold text-sm sm:text-xl text-gray-900">
                    {formatNumber(entry.followers)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {config?.metric || 'followers'}
                  </div>
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
            <p>Ranking data will appear here once the data is refreshed.</p>
          </div>
        </Card>
      )}

      {/* Remove subscription form from here since it's now on the Updates page */}
    </div>
  );
}