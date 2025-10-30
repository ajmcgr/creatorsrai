import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import Footer from "@/components/Footer";
import { SocialHandlesInput } from "@/components/SocialHandlesInput";
import { saveSocialStats } from "@/lib/saveSocialStats";
import type { SocialBundle, SocialStats, SocialStatsError } from "@/types/social";

const CreateMediaKit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    followers: "",
    engagement: "",
    email: "",
    rate: "",
    avatar_url: "",
    publicSlug: "",
  });

  const [socialHandles, setSocialHandles] = useState<Array<{
    id: string;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'twitch' | 'snapchat' | 'pinterest' | 'threads' | 'spotify';
    username: string;
    followerCount?: number;
    manualEntry?: boolean;
  }>>([]);

  useEffect(() => {
    if (!authLoading && !session) {
      toast.error("Please log in to create a media kit");
      navigate("/auth");
    }
  }, [session, authLoading, navigate]);

  // Prefill when navigating from Preview (Edit)
  useEffect(() => {
    const editId = (location.state as any)?.editId;
    if (!editId) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("media_kits")
          .select("*")
          .eq("id", editId)
          .maybeSingle();
        if (!error && data) {
          const socials: any = (data as any).social_data || {};

          // Convert social_data to handles array
          const handles: any[] = [];
          Object.entries(socials).forEach(([platform, value]: [string, any]) => {
            if (value && (platform === 'instagram' || platform === 'youtube' || platform === 'tiktok')) {
              const username = typeof value === 'string' ? value : (value.username || value.id || '');
              if (username) {
                handles.push({
                  id: `${platform}-${Date.now()}-${handles.length}`,
                  platform: platform as 'instagram' | 'youtube' | 'tiktok',
                  username
                });
              }
            }
          });

          setSocialHandles(handles);
          setFormData({
            name: (data as any).name || "",
            bio: (data as any).bio || "",
            followers: ((data as any).followers_total ?? "").toString(),
            engagement: ((data as any).avg_engagement_rate ?? 0).toString(),
            email: (data as any).email || "",
            rate: (data as any).custom_rate ? (data as any).custom_rate.toString() : "",
            avatar_url: (data as any).avatar_url || "",
            publicSlug: (data as any).public_url_slug || "",
          });
        }
      } catch (e) {
        console.error("Prefill load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [location.state]);

  const [step, setStep] = useState(1);

  const handleNext = async () => {
    // Validate step 1
    if (step === 1) {
      if (!formData.name || !formData.bio || !formData.email || !formData.publicSlug) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep(2);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 -> Save to database and go to preview
      setLoading(true);
      try {
        // Verify auth session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Session expired. Please log in again.");
          navigate("/auth");
          return;
        }

        if (!session?.user) {
          console.error("No session found");
          toast.error("Please log in to continue");
          navigate("/auth");
          return;
        }

        // Get AI rate suggestions
        let suggestedRates: any = {
          single_post: formData.rate ? parseInt(formData.rate) : 0,
          story_package: formData.rate ? Math.round(parseInt(formData.rate) * 0.6) : 0,
          full_campaign: "Custom"
        };

        if (formData.followers && formData.engagement) {
          try {
            const { data: ratesData, error: aiError } = await supabase.functions.invoke("ai-helper", {
              body: {
                type: "suggest_rates",
                data: {
                  followers: formData.followers,
                  engagement_rate: formData.engagement,
                  niche: "general"
                }
              }
            });
            if (aiError) {
              console.error("AI helper error:", aiError);
            } else if (ratesData) {
              suggestedRates = ratesData;
            }
          } catch (e) {
            console.error("AI helper exception:", e);
          }
        }

        // Create media kit in database
            // Convert handles array to social_data object
            const socialData: any = {};
            let manualFollowerTotal = 0;

            socialHandles.forEach(handle => {
              if (!socialData[handle.platform]) {
                socialData[handle.platform] = {
                  username: handle.username,
                  ...(handle.followerCount && { followerCount: handle.followerCount }),
                  ...(handle.manualEntry && { manualEntry: true })
                };

                // Add to manual follower total if manually entered
                if (handle.manualEntry && handle.followerCount) {
                  manualFollowerTotal += handle.followerCount;
                }
              }
            });

            // Use manual total if provided, otherwise use form data
            const totalFollowers = manualFollowerTotal > 0
              ? manualFollowerTotal
              : parseInt(formData.followers || "0");

            const { data: mediaKit, error: insertError } = await supabase
              .from("media_kits")
              .insert({
                user_id: session.user.id,
                name: formData.name,
                bio: formData.bio,
                email: formData.email,
                avatar_url: formData.avatar_url || null,
                social_data: socialData,
                followers_total: totalFollowers,
                avg_engagement_rate: parseFloat(formData.engagement || "0"),
                suggested_rates: suggestedRates,
                custom_rate: formData.rate ? parseInt(formData.rate) : null,
                layout_style: "minimal",
              })
              .select()
              .single();

        if (insertError) {
          console.error("Database insert error:", insertError);
          throw insertError;
        }

        if (!mediaKit) {
          throw new Error("No data returned from database");
        }

        toast.success("Media kit created!");

        // Handle public slug
        if (formData.publicSlug) {
          // User provided custom slug - validate it's unique
          const { data: existing } = await supabase
            .from('media_kits')
            .select('id')
            .eq('public_url_slug', formData.publicSlug)
            .single();

          if (existing) {
            toast.error(`URL /${formData.publicSlug} is already taken. Please choose another.`);
            setLoading(false);
            return;
          }

          await supabase.from('media_kits').update({ public_url_slug: formData.publicSlug }).eq('id', mediaKit.id);
        } else {
          // Auto-generate slug from name
          try {
            const { data: slug } = await supabase.rpc('generate_unique_slug', { base_name: formData.name || 'creator' });
            if (slug) {
              await supabase.from('media_kits').update({ public_url_slug: slug }).eq('id', mediaKit.id);
            }
          } catch (e) {
            console.warn('Slug generation failed', e);
          }
        }

        // Fetch social stats if handles were provided
        if (socialHandles.length > 0) {
          try {
            const { fetchSocialStats } = await import("@/lib/fetchSocialStats");
            const results: Partial<SocialBundle> = {};

            // Only fetch stats for supported platforms (instagram, youtube, tiktok)
            const supportedHandles = socialHandles.filter(h =>
              h.platform === 'instagram' || h.platform === 'youtube' || h.platform === 'tiktok'
            ) as Array<{id: string; platform: 'instagram' | 'youtube' | 'tiktok'; username: string}>;

            // Fetch all supported platforms in parallel
            const fetchPromises = supportedHandles.map(async (handle) => {
              try {
                const response = await fetchSocialStats(handle.platform, handle.username, mediaKit.id, { forceLive: true });

                if (response.ok && !results[handle.platform]) {
                  results[handle.platform] = response.data as SocialStats;
                  console.log(`${handle.platform} fetched (${response.source}):`, response.data);
                }
              } catch (err) {
                console.error(`${handle.platform} fetch error:`, err);
              }
            });

            await Promise.all(fetchPromises);

            // Save the stats if we got any
            if (Object.keys(results).length > 0) {
              await saveSocialStats(mediaKit.id, results as SocialBundle);
              toast.success("Social stats fetched successfully!");
            }
          } catch (error) {
            console.error("Error fetching social stats:", error);
            // Don't block the flow if social stats fail
          }
        }

        // Skip template selection and go straight to editor
        navigate(`/editor?kit_id=${mediaKit.id}`, { state: { justCreated: true } });
      } catch (error: any) {
        console.error("Save error:", error);
        toast.error(error.message || "Failed to save media kit. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFetchSocialData = async () => {
    if (socialHandles.length === 0) {
      toast.error("Please add at least one social media account");
      return;
    }

    setFetchingData(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.user?.id) {
        toast.error("Please sign in to continue");
        navigate("/auth");
        return;
      }

      const editId = (location.state as any)?.editId;
      let mediaKitId = editId;

      if (!mediaKitId) {
        // Convert handles array to social_data object
        const socialData: any = {};
        socialHandles.forEach(handle => {
          if (!socialData[handle.platform]) {
            socialData[handle.platform] = handle.username;
          }
        });

        const { data: draftKit, error: draftError } = await supabase
          .from("media_kits")
          .insert({
            user_id: currentSession.user.id,
            name: formData.name || "Draft Media Kit",
            bio: formData.bio,
            email: formData.email,
            social_data: socialData,
          })
          .select()
          .single();

        if (draftError) throw draftError;
        mediaKitId = draftKit.id;
      }

      const { fetchSocialStats } = await import("@/lib/fetchSocialStats");
      const results: Partial<SocialBundle> = {};
      const errors: string[] = [];

      // Only fetch stats for supported platforms (instagram, youtube, tiktok)
      const supportedHandles = socialHandles.filter(h =>
        h.platform === 'instagram' || h.platform === 'youtube' || h.platform === 'tiktok'
      ) as Array<{id: string; platform: 'instagram' | 'youtube' | 'tiktok'; username: string}>;

      // Fetch all supported platforms in parallel
      const fetchPromises = supportedHandles.map(async (handle) => {
        try {
          const response = await fetchSocialStats(handle.platform, handle.username, mediaKitId, { forceLive: true });

          if (response.ok) {
            // Store by platform (only one per platform for now)
            if (!results[handle.platform]) {
              results[handle.platform] = response.data as SocialStats;
              console.log(`${handle.platform} fetched (${response.source}):`, response.data);
            }
          } else {
            // response.ok is false, so it's SocialStatsError
            const errorResponse = response as SocialStatsError;
            const isUrl = handle.username.includes('://') || handle.username.startsWith('www.');

            let errMsg: string;
            if (errorResponse.error === 'HANDLE_NOT_FOUND') {
              if (isUrl) {
                errMsg = `${handle.platform}: Profile not found. The URL was parsed correctly, but this account may not exist in Social Blade's database.`;
              } else if (handle.platform === 'youtube') {
                errMsg = `${handle.platform}: Not found. Try pasting your full Channel URL (e.g., youtube.com/@yourhandle or youtube.com/channel/UC...)`;
              } else {
                errMsg = `${handle.platform}: Not found. Try pasting your profile URL (e.g., ${handle.platform}.com/@yourhandle)`;
              }
            } else {
              errMsg = `${handle.platform}: ${errorResponse.reason || errorResponse.error}`;
            }

            errors.push(errMsg);
            console.error(`${handle.platform} error:`, errorResponse);
          }
        } catch (err: any) {
          errors.push(`${handle.platform}: ${err.message}`);
          console.error(`${handle.platform} error:`, err);
        }
      });

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);

      setFetchingData(false);

      if (errors.length > 0) {
        errors.forEach(msg => toast.error(msg, { duration: 6000 }));
        toast.info("You can manually enter follower counts for platforms that failed to fetch.", { duration: 8000 });
      }

      if (Object.keys(results).length === 0) {
        toast.error("No social data fetched. Please manually enter follower counts below or check your usernames and try again.", { duration: 8000 });
        return;
      }

      // Save the standardized bundle to DB
      const saved = await saveSocialStats(mediaKitId, results as SocialBundle);
      console.log('[CreateMediaKit] Saved kit', saved.id);

      // Update local form data for display
      const platforms = Object.values(results).filter(Boolean);
      const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
      const engagementRates = platforms
        .map(p => p.engagement_rate)
        .filter((r): r is number => r !== null && r !== undefined);
      const avgEngagement = engagementRates.length > 0
        ? engagementRates.reduce((sum, r) => sum + r, 0) / engagementRates.length
        : 0;

      setFormData({
        ...formData,
        followers: totalFollowers.toString(),
        engagement: avgEngagement.toFixed(2),
        avatar_url: results.instagram?.avatar_url || results.youtube?.avatar_url || results.tiktok?.avatar_url || "",
      });

      toast.success(`Social data saved! ${Object.keys(results).length}/${socialHandles.length} accounts fetched. Opening preview...`);

      // Handle public slug
      if (formData.publicSlug) {
        // User provided custom slug - validate it's unique
        const { data: existing } = await supabase
          .from('media_kits')
          .select('id')
          .eq('public_url_slug', formData.publicSlug)
          .single();

        if (!existing) {
          await supabase.from('media_kits').update({ public_url_slug: formData.publicSlug }).eq('id', saved.id);
        }
      } else {
        // Auto-generate slug from name
        try {
          const { data: slug } = await supabase.rpc('generate_unique_slug', { base_name: formData.name || 'creator' });
          if (slug) {
            await supabase.from('media_kits').update({ public_url_slug: slug }).eq('id', saved.id);
          }
        } catch (e) {
          console.warn('Slug generation after social save failed', e);
        }
      }

      // Persist last saved kit id for routing guard
      try { sessionStorage.setItem('lastSavedKitId', saved.id); } catch {}

      // Navigate with the saved kit ID
      navigate(`/editor?kit_id=${saved.id}`, {
        state: { justSaved: true }
      });
    } catch (error: any) {
      console.error("Fetch social data error:", error);
      toast.error("Failed to fetch social data. Please try again or enter manually.");
      setFetchingData(false);
    }
  };

  const handlePolishBio = async () => {
    if (!formData.bio) {
      toast.error("Please enter a bio first");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-helper", {
        body: { type: "polish_bio", data: { bio: formData.bio } },
      });

      if (error) {
        console.error("Polish bio error:", error);
        throw error;
      }

      if (data?.result) {
        updateFormData("bio", data.result);
        toast.success("Bio polished with AI!");
      } else {
        throw new Error("No result from AI");
      }
    } catch (error: any) {
      console.error("Polish bio exception:", error);
      toast.error(error.message || "Failed to polish bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
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
      <AuthHeader showSettings showUpgrade />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {step} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Card className="p-8 shadow-card">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                  <p className="text-muted-foreground">Tell us about yourself</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Alex Johnson"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="bio">Bio *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handlePolishBio}
                        disabled={loading || !formData.bio}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Polish with AI
                      </Button>
                    </div>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell brands about yourself..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                   <div>
                     <Label htmlFor="publicSlug">Public Profile URL *</Label>
                     <div className="flex items-center gap-2">
                       <span className="text-muted-foreground">@</span>
                       <Input
                         id="publicSlug"
                         value={formData.publicSlug}
                         onChange={(e) => {
                           const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                           updateFormData("publicSlug", val);
                         }}
                         placeholder="alex"
                         required
                       />
                     </div>
                     <p className="text-xs text-muted-foreground mt-1">
                       Your media kit will be at: creatorsmediakit.com/{formData.publicSlug || 'yourname'}
                     </p>
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your social presence</h2>
                  <p className="text-muted-foreground">Enter your usernames to auto-fill your stats</p>
                </div>

                 <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Social Media Accounts</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add your social platforms. We'll try to fetch stats automatically, or you can enter follower counts manually.
                    </p>
                  </div>
                  <SocialHandlesInput
                    value={socialHandles}
                    onChange={setSocialHandles}
                  />

                  {socialHandles.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleFetchSocialData}
                      disabled={fetchingData}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {fetchingData ? "Fetching..." : "Auto-Fill My Social Stats"}
                    </Button>
                  )}
                </div>

                  <div className="text-sm text-muted-foreground text-center">
                    Or enter your stats manually below
                  </div>

                  <div>
                    <Label htmlFor="followers">Total Followers</Label>
                    <Input
                      id="followers"
                      type="number"
                      value={formData.followers}
                      onChange={(e) => updateFormData("followers", e.target.value)}
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="engagement">Engagement Rate (%)</Label>
                    <Input
                      id="engagement"
                      type="number"
                      value={formData.engagement}
                      onChange={(e) => updateFormData("engagement", e.target.value)}
                      placeholder="5.2"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pricing & partnerships</h2>
                  <p className="text-muted-foreground">Set your collaboration rates</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rate">Starting Rate (per post)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={formData.rate}
                      onChange={(e) => updateFormData("rate", e.target.value)}
                      placeholder="500"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This is your base rate for a single sponsored post
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Cancel</Link>
                </Button>
              )}

              <Button onClick={handleNext} disabled={loading}>
                {loading ? "Processing..." : step === 3 ? "Create & Preview" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateMediaKit;
