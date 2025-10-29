import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Edit, TrendingUp, TrendingDown, Eye, MousePointerClick, ExternalLink, BarChart3 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { DevSocialTest } from "@/components/DevSocialTest";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, loading, user } = useAuth();
  const [searchParams] = useSearchParams();
  const showDevTools = searchParams.get('dev') === 'true';

  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    }
}, [session, loading, navigate]);

  const [kits, setKits] = useState<any[]>([]);
  const [kitStats, setKitStats] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from('media_kits')
        .select('id,name,bio,public_url_slug,followers_total,avg_engagement_rate,avatar_url,updated_at,social_data,social_stats,custom_styles')
        .order('updated_at', { ascending: false });
      setKits(data || []);

      // Load stats for each kit
      if (data) {
        for (const kit of data) {
          loadKitStats(kit.id);
        }
      }
    };
    load();
  }, [session]);

  const loadKitStats = async (kitId: string) => {
    try {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get total views
      const { count: totalViews } = await supabase
        .from('media_kit_views')
        .select('*', { count: 'exact', head: true })
        .eq('media_kit_id', kitId);

      // Get views from last week
      const { count: lastWeekViews } = await supabase
        .from('media_kit_views')
        .select('*', { count: 'exact', head: true })
        .eq('media_kit_id', kitId)
        .gte('viewed_at', lastWeek.toISOString());

      // Get views from previous week (for comparison)
      const { count: previousWeekViews } = await supabase
        .from('media_kit_views')
        .select('*', { count: 'exact', head: true })
        .eq('media_kit_id', kitId)
        .gte('viewed_at', twoWeeksAgo.toISOString())
        .lt('viewed_at', lastWeek.toISOString());

      // Calculate percentage change
      const viewsChange = previousWeekViews && previousWeekViews > 0
        ? ((lastWeekViews! - previousWeekViews) / previousWeekViews) * 100
        : 0;

      setKitStats(prev => ({
        ...prev,
        [kitId]: {
          totalViews: totalViews || 0,
          viewsChange,
          totalClicks: 0, // Placeholder for now
          clicksChange: 0,
          conversionRate: 0,
          conversionChange: 0
        }
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteKit = async (kitId: string, kitName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${kitName}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('media_kits')
        .delete()
        .eq('id', kitId);

      if (error) throw error;

      setKits(kits.filter(k => k.id !== kitId));
      toast.success("Media kit deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete media kit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AuthHeader showSettings showUpgrade showReturnToDashboard={false} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header with Create Button */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-3xl font-medium" style={{ fontFamily: 'Reckless, serif' }}>
            Your Media Kit Pages
          </h1>
          <Link to="/create-media-kit">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Media Kit Page
            </Button>
          </Link>
        </div>

        {/* Media Kits List */}
        <div className="mb-12 animate-fade-in">
          {kits.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No media kit pages yet. Create your first one to get started.</p>
              <Link to="/create-media-kit">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Media Kit Page
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {kits.map((k) => {
                const socialData = k.social_data || k.social_stats || {};
                const platforms = Object.keys(socialData).filter(p => socialData[p]);
                const customStyles = k.custom_styles || {};

                // Build inline styles from custom_styles
                const cardStyle: React.CSSProperties = {};
                const headerStyle: React.CSSProperties = {};

                // Apply gradient or background image to header
                if (customStyles.backgroundImage) {
                  headerStyle.backgroundImage = `url(${customStyles.backgroundImage})`;
                  headerStyle.backgroundSize = 'cover';
                  headerStyle.backgroundPosition = 'center';
                } else if (customStyles.gradient) {
                  headerStyle.background = customStyles.gradient;
                } else {
                  headerStyle.background = 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))';
                }

                // Apply custom font
                if (customStyles.fontFamily) {
                  cardStyle.fontFamily = customStyles.fontFamily;
                }

                // Apply primary color for text accents
                const primaryColor = customStyles.primaryColor;
                const accentColor = customStyles.accentColor || customStyles.secondaryColor;

                return (
                  <Link key={k.id} to={`/editor?kit_id=${k.id}&edit=true`}>
                    <Card
                      className="overflow-hidden shadow-card hover:shadow-soft transition-all cursor-pointer group hover-lift"
                      style={cardStyle}
                    >
                      {/* Header with gradient or background image */}
                      <div
                        className="h-28 relative"
                        style={headerStyle}
                      >
                        <div className="absolute -bottom-10 left-6">
                          <img
                            src={k.avatar_url || '/placeholder.svg'}
                            alt={k.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                            loading="lazy"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-12">
                        <h3 className="text-xl font-bold mb-2 truncate text-foreground">
                          {k.name}
                        </h3>

                        {k.bio && (
                          <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{k.bio}</p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          <div className="text-center py-3 px-2 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Eye className="h-3 w-3 text-muted-foreground" />
                              <div className="text-xs text-muted-foreground">Views</div>
                            </div>
                            <div className="text-lg font-bold">
                              {kitStats[k.id]?.totalViews || 0}
                            </div>
                            {kitStats[k.id]?.viewsChange !== 0 && (
                              <div className={`text-xs flex items-center justify-center gap-1 ${kitStats[k.id]?.viewsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {kitStats[k.id]?.viewsChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(kitStats[k.id]?.viewsChange).toFixed(1)}%
                              </div>
                            )}
                          </div>

                          <div className="text-center py-3 px-2 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
                              <div className="text-xs text-muted-foreground">Clicks</div>
                            </div>
                            <div className="text-lg font-bold">
                              {kitStats[k.id]?.totalClicks || 0}
                            </div>
                            {kitStats[k.id]?.clicksChange !== 0 && (
                              <div className={`text-xs flex items-center justify-center gap-1 ${kitStats[k.id]?.clicksChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {kitStats[k.id]?.clicksChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(kitStats[k.id]?.clicksChange).toFixed(1)}%
                              </div>
                            )}
                          </div>

                          <div className="text-center py-3 px-2 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">CVR</div>
                            <div className="text-lg font-bold">
                              {kitStats[k.id]?.conversionRate || 0}%
                            </div>
                            {kitStats[k.id]?.conversionChange !== 0 && (
                              <div className={`text-xs flex items-center justify-center gap-1 ${kitStats[k.id]?.conversionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {kitStats[k.id]?.conversionChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(kitStats[k.id]?.conversionChange).toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Social Platforms */}
                        {platforms.length > 0 && (
                          <div className="flex items-center gap-2 mb-5">
                            <span className="text-xs text-muted-foreground">Platforms:</span>
                            <div className="flex gap-1.5">
                              {platforms.slice(0, 4).map(platform => (
                                <span
                                  key={platform}
                                  className="text-xs px-2 py-1 rounded capitalize bg-primary/10 text-primary"
                                >
                                  {platform}
                                </span>
                              ))}
                              {platforms.length > 4 && (
                                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                  +{platforms.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-2 pt-4 border-t">
                          {k.public_url_slug && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`/${k.public_url_slug}`, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/analytics?kit_id=${k.id}`);
                            }}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Link to={`/editor?kit_id=${k.id}&edit=true`} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteKit(k.id, k.name);
                            }}
                            className="h-9 w-9 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Developer Tools */}
        {showDevTools && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Developer Tools</h2>
            <DevSocialTest />
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
