import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Camera, Video, Users } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { useAvatarEnrichment } from "@/hooks/useAvatarEnrichment";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
type TopResponse = { fetched_at: string; items: TopItem[] };

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
  
  // Pagination (Top-200 shown as two pages of 100)
  const pageSize = 100;
  const total = data.length; // Use raw data length instead of enriched data
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedData = data.slice(start, start + pageSize);
  
  // Use avatar enrichment hook for progressive loading on the current page only
  const { items: enrichedPageData, loading: avatarLoading } = useAvatarEnrichment(pagedData, selectedPlatform);

  console.log(`Pagination: total=${total}, currentPage=${currentPage}, totalPages=${totalPages}`);
  console.log(`Data length: raw=${data.length}, enriched=${enrichedPageData.length}`);

  const fetchData = async (platform: Platform) => {
    setLoading(true);
    try {
      console.log(`Fetching ${platform} data from Social Blade API...`);
      
      // Call the social-blade-top API endpoint with limit=200
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-blade-top?platform=${platform}&limit=200`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('API request failed:', response.status);
        setData([]);
        setLastUpdated(null);
        return;
      }

      const result: TopResponse = await response.json();
      setData(result.items || []);
      setLastUpdated(result.fetched_at);
      console.log(`Successfully fetched ${result.items?.length || 0} items for ${platform}`);

    } catch (error) {
      console.error('Error fetching data:', error);
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
        <div className="text-sm text-gray-500 text-center">
          Updated {formatTimeAgo(lastUpdated)}
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-3">
        {enrichedPageData.map((entry, index) => {
          const config = PLATFORM_CONFIG[entry.platform];
          const Icon = config?.icon || Users;

          return (
            <Card 
              key={`${entry.platform}-${entry.id}`}
              className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-2xl font-bold text-gray-500">
                      {entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                    <AvatarImage 
                      src={entry.avatar} 
                      alt={entry.displayName}
                      className={avatarLoading && !entry.avatar ? 'opacity-50' : ''}
                    />
                    <AvatarFallback className={avatarLoading && !entry.avatar ? 'animate-pulse' : ''}>
                      {entry.displayName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate text-gray-900">
                      {entry.displayName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {config?.name || entry.platform}
                      </Badge>
                      {entry.username && (
                        <span className="text-sm text-gray-500">
                          @{entry.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right space-y-1">
                  <div className="font-bold text-xl text-gray-900">
                    {formatNumber(entry.followers)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {config?.metric || 'followers'}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {total > 100 && (
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
            <PaginationItem>
              <PaginationLink 
                href="#" 
                isActive={currentPage === 1} 
                onClick={(e) => { e.preventDefault(); setPage(1); }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === 2} 
                  onClick={(e) => { e.preventDefault(); setPage(2); }}
                >
                  2
                </PaginationLink>
              </PaginationItem>
            )}
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

      {data.length === 0 && !loading && (
        <Card className="p-12 text-center bg-gradient-surface">
          <div className="text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p>Leaderboard data will appear here once the weekly refresh runs.</p>
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