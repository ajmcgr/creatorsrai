import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/AuthHeader";
import { Eye, Users, TrendingUp, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Analytics = () => {
  const [mediaKits, setMediaKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaKits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('media_kits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMediaKits(data);
      }
      setLoading(false);
    };

    fetchMediaKits();
  }, []);

  const stats = [
    { label: "Total Views", value: "1,234", icon: Eye, change: "+12%" },
    { label: "Unique Visitors", value: "856", icon: Users, change: "+8%" },
    { label: "Engagement Rate", value: "24%", icon: TrendingUp, change: "+3%" },
    { label: "Click-through Rate", value: "18%", icon: MousePointerClick, change: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics</h1>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-primary">{stat.change}</p>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Media Kit Performance</CardTitle>
              <CardDescription>View detailed analytics for your media kits</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : mediaKits.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Create your first media kit to see analytics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mediaKits.map((kit) => {
                    const displayName = kit.name ||
                                       kit.social_stats?.instagram?.display_name || 
                                       kit.social_stats?.youtube?.display_name || 
                                       kit.social_stats?.tiktok?.display_name || 
                                       'Media Kit';
                    
                    return (
                      <div key={kit.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {kit.avatar_url && (
                              <img src={kit.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                            )}
                            <div>
                              <h3 className="font-semibold">{displayName}</h3>
                              <p className="text-sm text-muted-foreground">@{kit.username}</p>
                            </div>
                          </div>
                        </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Followers</p>
                          <p className="text-2xl font-bold">{kit.followers_total?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Engagement</p>
                          <p className="text-2xl font-bold">{kit.avg_engagement_rate ? `${kit.avg_engagement_rate.toFixed(1)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="text-sm">{kit.last_data_refresh ? new Date(kit.last_data_refresh).toLocaleDateString() : 'Never'}</p>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
