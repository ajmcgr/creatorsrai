import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Users, Play, Camera, Video, MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  platform: string;
  currentValue: number;
  previousValue: number;
  growth: number;
  growthPercentage: number;
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
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      console.log("Fetching leaderboard data...");
      
      const { data: leaderboardData, error } = await supabase
        .from('top_cache_latest_with_delta')
        .select('*')
        .order('current_value', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      if (!leaderboardData || leaderboardData.length === 0) {
        console.log("No data available");
        setData([]);
        return;
      }

      const formattedData: LeaderboardEntry[] = leaderboardData.map((item) => ({
        id: item.person_id || item.username || '',
        username: item.username || '',
        displayName: item.display_name || item.username || '',
        avatar: item.avatar || '',
        platform: item.platform || '',
        currentValue: item.current_value || 0,
        previousValue: item.prev_value || 0,
        growth: item.diff_value || 0,
        growthPercentage: item.prev_value > 0 ? ((item.diff_value || 0) / item.prev_value) * 100 : 0
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = selectedPlatform === 'all' 
    ? data 
    : data.filter(entry => entry.platform === selectedPlatform);

  const platforms = ['all', ...Object.keys(PLATFORM_CONFIG)];

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
          const config = platform === 'all' 
            ? { name: 'All Platforms', color: 'bg-primary' }
            : PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
          
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
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

      {/* Leaderboard */}
      <div className="space-y-3">
        {filteredData.map((entry, index) => {
          const config = PLATFORM_CONFIG[entry.platform as keyof typeof PLATFORM_CONFIG];
          const Icon = config?.icon || Users;
          const isGrowing = entry.growth > 0;
          const growthPercentage = entry.previousValue 
            ? ((entry.growth / entry.previousValue) * 100).toFixed(1)
            : '0';

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
                      {index + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                    <AvatarImage src={entry.avatar} alt={entry.displayName} />
                    <AvatarFallback>
                      {entry.displayName?.charAt(0) || entry.username?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate text-gray-900">
                      {entry.displayName || entry.username}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {config?.name || entry.platform}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        @{entry.username}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right space-y-1">
                  <div className="font-bold text-xl text-gray-900">
                    {formatNumber(entry.currentValue)}
                  </div>
                  
                  {entry.growth !== 0 && (
                    <div className={`flex items-center justify-end space-x-1 text-sm ${
                      isGrowing ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isGrowing ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {isGrowing ? '+' : ''}{formatNumber(entry.growth)}
                      </span>
                      <span className="text-gray-500">
                        ({isGrowing ? '+' : ''}{growthPercentage}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && !loading && (
        <Card className="p-12 text-center bg-gradient-surface">
          <div className="text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p>Leaderboard data will appear here once the weekly refresh runs.</p>
          </div>
        </Card>
      )}
    </div>
  );
}