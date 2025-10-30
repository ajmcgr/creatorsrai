// Editor page for media kit customization
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail, Instagram, Sparkles, FileDown, Palette, RefreshCw, Edit, X, Upload, Youtube, Music, ExternalLink, Home, Image as ImageIcon, Twitter, Facebook, Linkedin, Twitch, Camera, Pin, AtSign, Eye } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generatePDF, downloadCanvaData, generateCanvaTemplateUrl } from "@/lib/exportUtils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import logo from "@/assets/creators-logo.png";
import { SocialHandlesInput } from "@/components/SocialHandlesInput";
import { useMediaKit } from "@/hooks/useMediaKit";
import type { SocialBundle } from "@/types/social";
import { SocialCard } from "@/components/SocialCard";
import { Metric } from "@/components/SocialMetric";
import { applyThemeVars, themeFromCustomStyles } from "@/lib/themeUtils";
import { useTheme } from "@/hooks/useTheme";
import { ThemeEditor } from "@/components/ThemeEditor";
import PublicKit from "@/components/kit/PublicKit";
import type { PublicKitData, BackgroundMode } from "@/types/kit";
import { mapKitToPublicData } from "@/lib/kit/map";

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};

  // Always fetch from DB, not from location.state
  const search = new URLSearchParams(location.search);
  const kitId = search.get('kit_id');
  const isEditMode = search.get('edit') === 'true';
  const { kit: dbKit, loading: dbLoading, refetch } = useMediaKit(kitId || undefined);

  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(isEditMode);
  const [editData, setEditData] = useState<any>({});
  const [autoSaving, setAutoSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [styleDialogOpen, setStyleDialogOpen] = useState(false);
  const [tempLayoutStyle, setTempLayoutStyle] = useState<string>("minimal");
  const [tempCustomStyles, setTempCustomStyles] = useState<any>({});
  const [sectionStyles, setSectionStyles] = useState<any>({
    background: 'default',
    borderStyle: 'none',
    customColor: '#ffffff'
  });
  const [socialHandles, setSocialHandles] = useState<Array<{
    id: string;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'twitch' | 'snapchat' | 'pinterest' | 'threads' | 'spotify' | 'apple_podcasts';
    username: string;
    followerCount?: number;
    manualEntry?: boolean;
  }>>([]);
  const [showSocialEdit, setShowSocialEdit] = useState(false);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const [rates, setRates] = useState<Array<{ label: string; price: string }>>([]);
  const [documents, setDocuments] = useState<Array<{ name: string; url: string; size?: number }>>([]);
  const [clients, setClients] = useState<Array<{ name: string; logoUrl?: string }>>([]);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Use DB kit as source of truth, fallback to public fetch
  const [publicKit, setPublicKit] = useState<any>(null);
  const mediaKit = dbKit || publicKit;

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && kitId) {
        console.log('[Editor] User not authenticated, will use public fetch');
      } else if (user) {
        console.log('[Editor] User authenticated:', user.id);
      }
    };
    checkAuth();
  }, [kitId]);

  useEffect(() => {
    const resolveKit = async () => {
      if (!kitId) {
        console.warn('[Editor] No kit ID provided');
        // If we have a previously saved kit id, prefer using it
        const lastSaved = sessionStorage.getItem('lastSavedKitId');
        if (lastSaved) {
          navigate(`/editor?kit_id=${lastSaved}`, { replace: true });
          return;
        }
        // Otherwise, stay on this page and let the "Not Found" UI render instead of redirecting to an auth-protected route
        return;
      }
      const lastSaved = sessionStorage.getItem('lastSavedKitId');
      if (lastSaved && lastSaved !== kitId) {
        console.warn('[Editor] Kit ID mismatch. Using last saved kit.');
        navigate(`/editor?kit_id=${lastSaved}`, { replace: true });
      }
    };
    resolveKit();
  }, [kitId, navigate]);

  // Fallback: if not owner/not authed, try public fetch via backend function
  useEffect(() => {
    const tryPublicFetch = async () => {
      if (dbLoading) return;
      if (dbKit || !kitId) return;

      console.log('[Editor] DB fetch returned no kit, trying public fetch...');
      try {
        const { data, error } = await supabase.functions.invoke('fetch-media-kit-public', {
          body: { kit_id: kitId },
        });
        if (error) {
          console.warn('[Editor] Public fetch error:', error);
          return;
        }
        if (data?.ok && data.kit) {
          console.log('[Editor] Loaded via public fetch:', data.kit);
          setPublicKit(data.kit);
        } else {
          console.warn('[Editor] Public fetch returned no kit');
        }
      } catch (e) {
        console.warn('[Editor] Public fetch exception:', e);
      }
    };
    tryPublicFetch();
  }, [dbLoading, dbKit, kitId]);

  // Sync editData and other state when mediaKit loads from DB (only on initial load, not on refetch)
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!mediaKit) return;
    if (hasInitialized.current && editMode) return; // Don't override user edits during edit mode

    console.log('[Preview] kit_id param', kitId, 'payload', mediaKit.social_stats);

    setEditData({ ...mediaKit, ai_summary: mediaKit.ai_summary || "" });
    setTempLayoutStyle(mediaKit.layout_style || "minimal");
    setTempCustomStyles(mediaKit.custom_styles || {});

    if (mediaKit.custom_styles?.sectionStyles) {
      setSectionStyles(mediaKit.custom_styles.sectionStyles);
    }

    if (mediaKit.ai_summary) {
      setAiSummary(mediaKit.ai_summary);
    }

    // Load rates
    const s = mediaKit.custom_styles || {};
    if (mediaKit.rates || s.rates) {
      setRates(mediaKit.rates || (s as any).rates || []);
    }

    // Load documents
    if (mediaKit.documents || s.documents) {
      setDocuments(mediaKit.documents || (s as any).documents || []);
    }

    // Load clients
    if (mediaKit.clients || s.clients) {
      setClients(mediaKit.clients || (s as any).clients || []);
    }

    // Convert social_stats or social_data to handles array
    const socialData = (mediaKit.social_stats || mediaKit.social_data) as SocialBundle | any;
    const handles: any[] = [];

    if (socialData) {
      Object.entries(socialData).forEach(([platform, value]: [string, any]) => {
        if (value) {
          let username = '';
          let followerCount: number | undefined;
          let manualEntry = false;

          if (typeof value === 'string') {
            username = value;
          } else if (typeof value === 'object') {
            username = value.username || value.id || '';
            followerCount = value.followerCount || value.followers;
            manualEntry = value.manualEntry || false;
          }

          if (username) {
            handles.push({
              id: `${platform}-${Date.now()}-${handles.length}`,
              platform,
              username,
              followerCount,
              manualEntry
            });
          }
        }
      });
    }

    setSocialHandles(handles);
    hasInitialized.current = true;
  }, [mediaKit, editMode, kitId]);

  // Auto-save function - saves to both draft and published for immediate live updates
  const autoSave = async () => {
    if (!mediaKit?.id || !editMode) return;

    setAutoSaving(true);

    try {
      // Convert handles array to social_data object
      const socialData: any = {};
      let manualFollowerTotal = 0;

      socialHandles.forEach(handle => {
        socialData[handle.platform] = {
          username: handle.username,
          ...(handle.followerCount && {
            followerCount: handle.followerCount,
            followers: handle.followerCount
          }),
          ...(handle.manualEntry !== undefined && { manualEntry: handle.manualEntry })
        };

        if (handle.followerCount) {
          manualFollowerTotal += handle.followerCount;
        }
      });

      // Build snapshot for both draft and published
      const kitSnapshot = {
        ...mediaKit,
        name: editData.name,
        bio: editData.bio,
        email: editData.email,
        avatar_url: editData.avatar_url,
        ai_summary: editData.ai_summary || null,
        social_data: socialData,
        social_stats: socialData,
        followers_total: manualFollowerTotal > 0 ? manualFollowerTotal : mediaKit.followers_total,
        custom_styles: {
          ...tempCustomStyles,
          sectionStyles,
          rates: rates.length > 0 ? rates : null,
          documents: documents.length > 0 ? documents : null,
          clients: clients.length > 0 ? clients : null,
        },
      };

      const publicSnapshot = mapKitToPublicData(kitSnapshot, { preferSnapshot: false });

      const updateData: any = {
        name: editData.name,
        bio: editData.bio,
        email: editData.email,
        avatar_url: editData.avatar_url,
        custom_rate: editData.custom_rate ? parseInt(editData.custom_rate) : null,
        ai_summary: editData.ai_summary || null,
        social_data: socialData,
        social_stats: socialData,
        layout_style: tempLayoutStyle,
        custom_styles: kitSnapshot.custom_styles,
        draft_json: publicSnapshot,
        published_json: publicSnapshot, // Auto-publish changes
        published_at: new Date().toISOString(),
      };

      if (manualFollowerTotal > 0) {
        updateData.followers_total = manualFollowerTotal;
      }

      const { error } = await supabase
        .from("media_kits")
        .update(updateData)
        .eq("id", mediaKit.id);

      if (error) throw error;

      toast.success("Changes saved");
    } catch (error: any) {
      console.error("Auto-save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setAutoSaving(false);
    }
  };

  const lastSavedState = useRef<string>('');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!editMode || !mediaKit?.id) return;
    if (initializedRef.current) return;

    const snapshot = JSON.stringify({
      name: editData.name,
      bio: editData.bio,
      email: editData.email,
      avatar_url: editData.avatar_url,
      ai_summary: editData.ai_summary,
      layout_style: tempLayoutStyle,
      custom_styles: tempCustomStyles,
      section_styles: sectionStyles,
      rates,
      documents,
      clients,
      social_handles: socialHandles.map(h => ({
        platform: h.platform,
        username: h.username,
        followerCount: h.followerCount,
        manualEntry: h.manualEntry
      }))
    });

    lastSavedState.current = snapshot;
    initializedRef.current = true;
  }, [editMode, mediaKit?.id]);

  useEffect(() => {
    if (!editMode || !mediaKit?.id) return;

    const currentState = JSON.stringify({
      name: editData.name,
      bio: editData.bio,
      email: editData.email,
      avatar_url: editData.avatar_url,
      ai_summary: editData.ai_summary,
      layout_style: tempLayoutStyle,
      custom_styles: tempCustomStyles,
      section_styles: sectionStyles,
      rates,
      documents,
      clients,
      social_handles: socialHandles.map(h => ({
        platform: h.platform,
        username: h.username,
        followerCount: h.followerCount,
        manualEntry: h.manualEntry
      }))
    });

    if (currentState === lastSavedState.current) return;

    const timeoutId = setTimeout(() => {
      lastSavedState.current = currentState;
      autoSave();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [editData, socialHandles, tempLayoutStyle, tempCustomStyles, sectionStyles, rates, documents, clients, editMode, mediaKit?.id]);

  useEffect(() => {
    if (!mediaKit?.id) return;
    const hasArrays = (rates && rates.length > 0) || (documents && documents.length > 0) || (clients && clients.length > 0);
    if (!hasArrays) return;

    const timeout = setTimeout(async () => {
      try {
        const kitSnapshot = {
          ...mediaKit,
          custom_styles: {
            ...(mediaKit.custom_styles || {}),
            ...(Object.keys(tempCustomStyles).length > 0 ? tempCustomStyles : {}),
            sectionStyles,
            rates,
            documents,
            clients,
          },
        };
        const publicSnapshot = mapKitToPublicData(kitSnapshot, { preferSnapshot: false });

        const { error } = await supabase
          .from("media_kits")
          .update({
            custom_styles: kitSnapshot.custom_styles,
            draft_json: publicSnapshot,
            published_json: publicSnapshot,
            published_at: new Date().toISOString(),
          })
          .eq("id", mediaKit.id);
        if (!error) {
          toast.success("Changes synced", { duration: 2000 });
        }
      } catch (e) {
        console.warn('[Editor] Force-sync arrays failed', e);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [mediaKit?.id, rates, documents, clients, sectionStyles, tempCustomStyles]);

  const handleFetchSocialDataInEditor = async () => {
    if (socialHandles.length === 0) {
      toast.error("Please add at least one social media account");
      return;
    }

    if (!mediaKit?.id) {
      toast.error("Media kit not found");
      return;
    }

    setLoading(true);
    try {
      const { fetchSocialStats } = await import("@/lib/fetchSocialStats");
      const results: Partial<SocialBundle> = {};
      const errors: string[] = [];

      const supportedHandles = socialHandles.filter(h =>
        h.platform === 'instagram' || h.platform === 'youtube' || h.platform === 'tiktok'
      ) as Array<{id: string; platform: 'instagram' | 'youtube' | 'tiktok'; username: string}>;

      const fetchPromises = supportedHandles.map(async (handle) => {
        try {
          const response = await fetchSocialStats(handle.platform, handle.username, mediaKit.id, { forceLive: true });

          if (response.ok) {
            if (!results[handle.platform]) {
              results[handle.platform] = response.data as any;
              console.log(`${handle.platform} fetched (${response.source}):`, response.data);
            }
          } else {
            const errorResponse = response as any;
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

      await Promise.all(fetchPromises);

      if (errors.length > 0) {
        errors.forEach(msg => toast.error(msg, { duration: 6000 }));
        toast.info("You can manually enter follower counts for platforms that failed to fetch.", { duration: 8000 });
      }

      if (Object.keys(results).length === 0) {
        toast.error("No social data fetched. Please manually enter follower counts or check your usernames and try again.", { duration: 8000 });
        return;
      }

      const { saveSocialStats } = await import("@/lib/saveSocialStats");
      await saveSocialStats(mediaKit.id, results as SocialBundle);

      const platforms = Object.values(results).filter(Boolean);
      const totalFollowers = platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
      const engagementRates = platforms
        .map(p => p.engagement_rate)
        .filter((r): r is number => r !== null && r !== undefined);
      const avgEngagement = engagementRates.length > 0
        ? engagementRates.reduce((sum, r) => sum + r, 0) / engagementRates.length
        : 0;

      setEditData({
        ...editData,
        followers_total: totalFollowers,
        avg_engagement_rate: avgEngagement,
        avatar_url: results.instagram?.avatar_url || results.youtube?.avatar_url || results.tiktok?.avatar_url || editData.avatar_url,
      });

      await refetch();
      toast.success(`Social data saved! ${Object.keys(results).length}/${socialHandles.length} accounts fetched.`);
    } catch (error: any) {
      console.error("Fetch social data error:", error);
      toast.error("Failed to fetch social data. Please try again or enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (mediaKit?.avatar_url) {
        const oldPath = mediaKit.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setEditData({ ...editData, avatar_url: publicUrl });
      toast.success("Avatar uploaded!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      return;
    }

    setLoading(true);
    try {
      const uploadedDocs: Array<{ name: string; url: string; size?: number }> = [];

      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        uploadedDocs.push({
          name: file.name,
          url: publicUrl,
          size: file.size
        });
      }

      setDocuments([...documents, ...uploadedDocs]);
      toast.success(`${uploadedDocs.length} document(s) uploaded!`);
    } catch (error: any) {
      console.error("Document upload error:", error);
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setLoading(false);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = async (index: number) => {
    const doc = documents[index];
    try {
      const urlParts = doc.url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      await supabase.storage.from('documents').remove([filePath]);

      setDocuments(documents.filter((_, i) => i !== index));
      toast.success("Document deleted");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleSaveEdit = async () => {
    if (!mediaKit?.id) return;

    setLoading(true);
    try {
      const socialData: any = {};
      let manualFollowerTotal = 0;

      socialHandles.forEach(handle => {
        socialData[handle.platform] = {
          username: handle.username,
          ...(handle.followerCount && {
            followerCount: handle.followerCount,
            followers: handle.followerCount
          }),
          ...(handle.manualEntry !== undefined && { manualEntry: handle.manualEntry })
        };

        if (handle.followerCount) {
          manualFollowerTotal += handle.followerCount;
        }
      });

      const updateData: any = {
        name: editData.name,
        bio: editData.bio,
        email: editData.email,
        avatar_url: editData.avatar_url,
        custom_rate: editData.custom_rate ? parseInt(editData.custom_rate) : null,
        ai_summary: editData.ai_summary || null,
        social_data: socialData,
        social_stats: socialData,
        layout_style: tempLayoutStyle,
        custom_styles: {
          ...(mediaKit.custom_styles || {}),
          ...(Object.keys(tempCustomStyles).length > 0 ? tempCustomStyles : {}),
          sectionStyles,
          ...(rates.length > 0 ? { rates } : {}),
          ...(documents.length > 0 ? { documents } : {}),
          ...(clients.length > 0 ? { clients } : {}),
        },
      };
      
      if (manualFollowerTotal > 0) {
        updateData.followers_total = manualFollowerTotal;
      }

      const { error } = await supabase
        .from("media_kits")
        .update(updateData)
        .eq("id", mediaKit.id);

      if (error) throw error;

      await refetch();
      setEditMode(false);
      setShowSocialEdit(false);
      toast.success("Changes saved!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (mediaKit) {
      setEditData(mediaKit);

      const socialData = (mediaKit.social_stats || mediaKit.social_data) as SocialBundle | any;
      const handles: any[] = [];

      if (socialData) {
        Object.entries(socialData).forEach(([platform, value]: [string, any]) => {
          if (value) {
            let username = '';
            let followerCount: number | undefined;
            let manualEntry = false;

            if (typeof value === 'string') {
              username = value;
            } else if (typeof value === 'object') {
              username = value.username || value.id || '';
              followerCount = value.followerCount || value.followers;
              manualEntry = value.manualEntry || false;
            }

            if (username) {
              handles.push({
                id: `${platform}-${Date.now()}-${handles.length}`,
                platform,
                username,
                followerCount,
                manualEntry
              });
            }
          }
        });
      }

      setSocialHandles(handles);
    }
    setEditMode(false);
    setShowSocialEdit(false);
  };

  const templates = [
    { id: "minimal", name: "Minimal", colors: ["#FFFFFF", "#111827"], gradient: "linear-gradient(to bottom, #FFFFFF, #F9FAFB)" },
    { id: "editorial", name: "Editorial", colors: ["#000000", "#FF6F61"], gradient: "linear-gradient(135deg, #000000, #1F2937)" },
    { id: "creator_pop", name: "Creator Pop", colors: ["#F3E8FF", "#EC4899"], gradient: "linear-gradient(135deg, #F3E8FF, #FCE7F3)" },
    { id: "luxury", name: "Luxury", colors: ["#0F172A", "#FCD34D"], gradient: "linear-gradient(180deg, #0F172A, #1E293B)" },
    { id: "neon_glow", name: "Neon Glow", colors: ["#020617", "#06B6D4"], gradient: "linear-gradient(180deg, #020617, #0F172A)" },
    { id: "nature", name: "Nature", colors: ["#FFFBEB", "#047857"], gradient: "linear-gradient(135deg, #FFFBEB, #ECFCCB)" },
    { id: "sunset", name: "Sunset", colors: ["#FFF7ED", "#DC2626"], gradient: "linear-gradient(135deg, #FFF7ED, #FEE2E2)" },
    { id: "ocean", name: "Ocean", colors: ["#EFF6FF", "#0284C7"], gradient: "linear-gradient(135deg, #EFF6FF, #CFFAFE)" },
    { id: "monochrome", name: "Monochrome", colors: ["#000000", "#FFFFFF"], gradient: "linear-gradient(180deg, #000000, #18181B)" },
  ];

  const applyTemplateColors = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setTempCustomStyles({
        ...tempCustomStyles,
        primaryColor: template.colors[0],
        secondaryColor: template.colors[1],
        accentColor: template.colors[1],
        fontFamily: tempCustomStyles.fontFamily || "Inter",
        gradient: template.gradient,
        backgroundImage: undefined
      });
    }
  };

  const handleSaveStyles = async () => {
    if (!mediaKit?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("media_kits")
        .update({
          layout_style: tempLayoutStyle,
          custom_styles: {
            ...(mediaKit.custom_styles || {}),
            ...(Object.keys(tempCustomStyles).length > 0 ? tempCustomStyles : {}),
            sectionStyles,
            ...(rates.length > 0 ? { rates } : {}),
            ...(documents.length > 0 ? { documents } : {}),
            ...(clients.length > 0 ? { clients } : {}),
          }
        })
        .eq("id", mediaKit.id);

      if (error) throw error;

      await refetch();
      setStyleDialogOpen(false);
      toast.success("Style updated!");
    } catch (error: any) {
      console.error("Style update error:", error);
      toast.error(error.message || "Failed to update style");
    } finally {
      setLoading(false);
    }
  };

  const generateAiSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-helper", {
        body: {
          type: "audience_summary",
          data: {
            followers_total: mediaKit?.followers_total || 0,
            avg_engagement_rate: mediaKit?.avg_engagement_rate || 0,
            platforms: mediaKit?.social_data?.instagram ? "Instagram" : "social media",
          },
        },
      });

      if (error) throw error;
      if (data?.result) {
        setAiSummary(data.result);

        if (mediaKit?.id) {
          await supabase
            .from("media_kits")
            .update({ ai_summary: data.result })
            .eq("id", mediaKit.id);

          await refetch();
        }

        toast.success("AI summary generated!");
      }
    } catch (error) {
      console.error("AI summary error:", error);
      toast.error("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!mediaKit) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/create-media-kit')}>
            Create New Profile
          </Button>
        </Card>
      </div>
    );
  }

  const handlePurchase = () => {
    navigate("/upgrade");
  };

  const handleDownloadPDF = async () => {
    if (!mediaKit?.paid) {
      toast.error("Please purchase to download PDF");
      navigate("/upgrade");
      return;
    }

    setLoading(true);
    try {
      await generatePDF("media-kit-preview", `${formData.name}-MediaKit.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!mediaKit?.paid) {
      toast.error("Please purchase to refresh data");
      navigate("/upgrade");
      return;
    }

    setLoading(true);
    try {
      const socialData = mediaKit.social_data || {};
      const platforms: Array<"instagram" | "youtube" | "tiktok"> = [];
      if (socialData.instagram) platforms.push("instagram");
      if (socialData.youtube) platforms.push("youtube");
      if (socialData.tiktok) platforms.push("tiktok");

      const results: Record<string, any> = {};
      let hasError = false;

      for (const platform of platforms) {
        const handle = (socialData as any)[platform];
        if (!handle) continue;
        try {
          const { fetchSocialGated } = await import("@/lib/socialBladeGated");
          const response = await fetchSocialGated(mediaKit.id, platform, handle, true);
          results[platform] = response.data;
          console.log(`${platform} refreshed (${response.source})`);
        } catch (err: any) {
          if (err.code === "PAID_REQUIRED") {
            toast.error("Upgrade to Pro for unlimited stat refreshes");
            navigate("/upgrade");
            setLoading(false);
            return;
          }
          hasError = true;
          console.error(`${platform} refresh error:`, err);
          toast.error(`${platform}: ${err.message || "Unknown error"}`);
        }
      }

      if (hasError && Object.keys(results).length === 0) {
        toast.error("Failed to refresh any social data.");
        setLoading(false);
        return;
      }

      let totalFollowers = 0;
      let totalEngagement = 0;
      let engagementCount = 0;
      let avatarUrl = mediaKit.avatar_url || "";

      if (results.instagram) {
        totalFollowers += results.instagram.followers || 0;
        if (results.instagram.engagement_rate) {
          totalEngagement += results.instagram.engagement_rate;
          engagementCount++;
        }
        avatarUrl = avatarUrl || results.instagram.profile_picture_url || "";
      }

      if (results.youtube) {
        totalFollowers += results.youtube.subscribers || 0;
        avatarUrl = avatarUrl || results.youtube.profile_picture_url || "";
      }

      if (results.tiktok) {
        totalFollowers += results.tiktok.followers || 0;
        avatarUrl = avatarUrl || results.tiktok.profile_picture_url || "";
      }

      const avgEngagement = engagementCount > 0 ? totalEngagement / engagementCount : 0;

      const updatedSocialData = {
        ...socialData,
        instagram_followers: results.instagram?.followers || 0,
        youtube_subscribers: results.youtube?.subscribers || 0,
        tiktok_followers: results.tiktok?.followers || 0,
      };

      const { error: updateError } = await supabase
        .from("media_kits")
        .update({
          followers_total: totalFollowers,
          avg_engagement_rate: avgEngagement,
          avatar_url: avatarUrl,
          social_data: updatedSocialData,
          last_data_refresh: new Date().toISOString(),
        })
        .eq("id", mediaKit.id);

      if (updateError) throw updateError;

      await refetch();
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Refresh data error:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCanva = () => {
    if (!mediaKit?.paid) {
      toast.error("Please purchase to export to Canva");
      navigate("/upgrade");
      return;
    }

    try {
      downloadCanvaData(
        {
          ...formData,
          ...mediaKit,
        },
        `${formData.name}-CanvaData.json`
      );

      const canvaUrl = generateCanvaTemplateUrl(
        { ...formData, ...mediaKit },
        mediaKit?.layout_style || "minimal"
      );

      toast.success("Canva data downloaded! You can also use this template link:");
      window.open(canvaUrl, "_blank");
    } catch (error) {
      console.error("Canva export error:", error);
      toast.error("Failed to export to Canva");
    }
  };

  const getTemplateStyles = (style: string) => {
    const styles: Record<string, any> = {
      minimal: {
        bg: "bg-white",
        text: "text-gray-900",
        accent: "text-gray-600",
        card: "bg-gray-50",
      },
      editorial: {
        bg: "bg-gradient-to-br from-black to-gray-900",
        text: "text-white",
        accent: "text-[#FF6F61]",
        card: "bg-gray-900",
      },
      creator_pop: {
        bg: "bg-gradient-to-br from-purple-50 to-pink-50",
        text: "text-purple-900",
        accent: "text-pink-600",
        card: "bg-white/80 backdrop-blur",
      },
      luxury: {
        bg: "bg-slate-900",
        text: "text-amber-100",
        accent: "text-amber-500",
        card: "bg-slate-800/80 backdrop-blur border-amber-500/20",
      },
      neon_glow: {
        bg: "bg-slate-950",
        text: "text-cyan-100",
        accent: "text-cyan-400",
        card: "bg-slate-900/90 backdrop-blur border-cyan-500/30",
      },
      nature: {
        bg: "bg-gradient-to-br from-amber-50 to-green-50",
        text: "text-green-900",
        accent: "text-amber-700",
        card: "bg-white/90 backdrop-blur border-green-200",
      },
    };
    return styles[style] || styles.minimal;
  };

  const templateStyle = getTemplateStyles(mediaKit?.layout_style || (formData.layout_style as string) || "minimal");
  const customStyles = mediaKit?.custom_styles || formData.custom_styles || {};
  const hasCustomStyles = customStyles && Object.keys(customStyles).length > 0;

  const getSectionCardClasses = () => {
    const sectionStylesConfig = customStyles?.sectionStyles || { background: 'default', borderStyle: 'none' };
    let baseClasses = "p-8 shadow-card";

    if (sectionStylesConfig.background === 'white') {
      baseClasses += " bg-white";
    } else if (sectionStylesConfig.background === 'colored' && hasCustomStyles) {
      baseClasses += "";
    } else if (sectionStylesConfig.background === 'gradient') {
      baseClasses += " bg-gradient-to-br from-primary/5 to-accent/5";
    } else if (sectionStylesConfig.background === 'glass') {
      baseClasses += " bg-white/10 backdrop-blur-lg";
    } else {
      baseClasses += hasCustomStyles ? "" : ` ${templateStyle.card}`;
    }

    if (sectionStylesConfig.borderStyle === 'subtle') {
      baseClasses += " border border-gray-200/50";
    } else if (sectionStylesConfig.borderStyle === 'outlined') {
      baseClasses += " border-2 border-gray-300";
    } else if (sectionStylesConfig.borderStyle === 'bold') {
      baseClasses += " border-4";
    }

    return baseClasses;
  };

  const getSectionCardStyle = () => {
    if (!hasCustomStyles) return {};

    const sectionStylesConfig = customStyles?.sectionStyles || { background: 'default', borderStyle: 'none' };
    const baseStyle: any = {
      fontFamily: customStyles.fontFamily
    };

    if (sectionStylesConfig.background === 'colored') {
      baseStyle.backgroundColor = customStyles.primaryColor;
      baseStyle.color = customStyles.secondaryColor;
    } else if (sectionStylesConfig.background === 'glass') {
      baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      baseStyle.backdropFilter = 'blur(16px)';
    }

    if (sectionStylesConfig.borderStyle === 'bold') {
      baseStyle.borderColor = customStyles.accentColor || customStyles.primaryColor;
    }

    return baseStyle;
  };

  return (
    <div
      className={`min-h-screen ${editMode ? 'bg-gradient-subtle' : (hasCustomStyles ? '' : templateStyle.bg)}`}
      style={!editMode && hasCustomStyles && customStyles.backgroundImage ? {
        backgroundImage: `url(${customStyles.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : !editMode && hasCustomStyles ? { background: customStyles.gradient || templateStyle.bg } : {}}
    >
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-white backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Creators" className="h-8" />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              Return to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                {mediaKit?.public_url_slug && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/${mediaKit.public_url_slug}`;
                      window.open(url, '_blank');
                    }}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setEditMode(true)} className="hover:bg-primary hover:text-primary-foreground">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {mediaKit?.public_url_slug && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/${mediaKit.public_url_slug}`;
                      window.open(url, '_blank');
                    }}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Media Kit Preview/Editor */}
        <div id="media-kit-preview" className={editMode ? "grid md:grid-cols-2 gap-8 max-w-7xl mx-auto" : "max-w-4xl mx-auto space-y-8"}>
          {editMode && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Media Kit Page</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="edit-email">Contact Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {editData.avatar_url && (
                        <img
                          src={editData.avatar_url}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {editData.avatar_url ? "Change Photo" : "Upload Photo"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      value={editData.bio || ""}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={4}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-ai-summary">Summary</Label>
                    <Textarea
                      id="edit-ai-summary"
                      value={editData.ai_summary || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, ai_summary: e.target.value });
                        setAiSummary(e.target.value);
                      }}
                      rows={4}
                      placeholder="AI-generated summary..."
                      className="mt-1.5"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={generateAiSummary}
                      disabled={loading}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {loading ? "Generating..." : "Generate AI Summary"}
                    </Button>
                  </div>

                  <div>
                    <Label>Social Media Accounts</Label>
                    <SocialHandlesInput
                      value={socialHandles}
                      onChange={setSocialHandles}
                    />
                    {socialHandles.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-3"
                        onClick={handleFetchSocialDataInEditor}
                        disabled={loading}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {loading ? "Fetching..." : "Auto-Fill My Social Stats"}
                      </Button>
                    )}
                  </div>

                  <div className="border-t pt-5">
                    <Label className="mb-3 block">Collaboration Rates</Label>
                    <div className="space-y-3">
                      {rates.map((rate, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Label (e.g., Instagram Post)"
                            value={rate.label}
                            onChange={(e) => {
                              const newRates = [...rates];
                              newRates[index].label = e.target.value;
                              setRates(newRates);
                            }}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Price (e.g., $500)"
                            value={rate.price}
                            onChange={(e) => {
                              const newRates = [...rates];
                              newRates[index].price = e.target.value;
                              setRates(newRates);
                            }}
                            className="w-32"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setRates(rates.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRates([...rates, { label: '', price: '' }])}
                        className="w-full"
                      >
                        Add Rate
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-5">
                    <Label className="mb-3 block">Portfolio</Label>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Link name (e.g., Case Study)"
                              value={doc.name}
                              onChange={(e) => {
                                const newDocs = [...documents];
                                newDocs[index].name = e.target.value;
                                setDocuments(newDocs);
                              }}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="URL (e.g., https://example.com/portfolio.pdf)"
                            value={doc.url}
                            onChange={(e) => {
                              const newDocs = [...documents];
                              newDocs[index].url = e.target.value;
                              setDocuments(newDocs);
                            }}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDocuments([...documents, { name: '', url: '' }])}
                        className="w-full"
                      >
                        Add Portfolio Link
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-5">
                    <Label className="mb-3 block">Clients</Label>
                    <div className="space-y-3">
                      {clients.map((client, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Client name"
                            value={client.name}
                            onChange={(e) => {
                              const newClients = [...clients];
                              newClients[index].name = e.target.value;
                              setClients(newClients);
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setClients(clients.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setClients([...clients, { name: '', logoUrl: undefined }])}
                        className="w-full"
                      >
                        Add Client
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-5">
                    <Label className="text-xl font-semibold mb-4 block">Themes & Colors</Label>
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-3 block">Template Presets</Label>
                            <div className="grid grid-cols-3 gap-3">
                              {templates.map(template => (
                                <Button
                                  key={template.id}
                                  variant="outline"
                                  onClick={() => applyTemplateColors(template.id)}
                                  className="h-auto flex-col p-4"
                                >
                                  <div
                                    className="w-full h-16 rounded mb-2"
                                    style={{ background: template.gradient }}
                                  />
                                  <span className="text-sm">{template.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                            <select
                              id="font-family"
                              value={tempCustomStyles.fontFamily || "Inter"}
                              onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, fontFamily: e.target.value })}
                              className="w-full p-2 border rounded mt-1.5"
                            >
                              <optgroup label="Sans-serif (Modern)">
                                <option value="'Inter', sans-serif">Inter</option>
                                <option value="'Poppins', sans-serif">Poppins</option>
                                <option value="'Montserrat', sans-serif">Montserrat</option>
                                <option value="'Roboto', sans-serif">Roboto</option>
                                <option value="'Open Sans', sans-serif">Open Sans</option>
                                <option value="'Lato', sans-serif">Lato</option>
                              </optgroup>
                              <optgroup label="Serif (Classic)">
                                <option value="'Playfair Display', serif">Playfair Display</option>
                                <option value="'Merriweather', serif">Merriweather</option>
                                <option value="'Lora', serif">Lora</option>
                                <option value="'Crimson Text', serif">Crimson Text</option>
                              </optgroup>
                              <optgroup label="Display (Bold)">
                                <option value="'Oswald', sans-serif">Oswald</option>
                                <option value="'Bebas Neue', sans-serif">Bebas Neue</option>
                                <option value="'Anton', sans-serif">Anton</option>
                              </optgroup>
                            </select>
                          </div>

                          <div>
                            <Label htmlFor="secondary-color" className="text-sm">Text Color</Label>
                            <div className="flex gap-3 items-center mt-1.5">
                              <Input
                                id="secondary-color"
                                type="color"
                                value={tempCustomStyles.secondaryColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, secondaryColor: e.target.value })}
                                className="w-20 h-10"
                              />
                              <Input
                                type="text"
                                value={tempCustomStyles.secondaryColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, secondaryColor: e.target.value })}
                                placeholder="#FFFFFF"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="primary-color" className="text-sm">Background Color</Label>
                            <div className="flex gap-3 items-center mt-1.5">
                              <Input
                                id="primary-color"
                                type="color"
                                value={tempCustomStyles.primaryColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, primaryColor: e.target.value })}
                                className="w-20 h-10"
                              />
                              <Input
                                type="text"
                                value={tempCustomStyles.primaryColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, primaryColor: e.target.value })}
                                placeholder="#FFFFFF"
                                className="text-sm"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Solid background color (overridden by gradient/image)</p>
                          </div>

                          <div>
                            <Label className="text-sm">Background Gradient</Label>
                            <p className="text-xs text-muted-foreground mb-2">Overrides solid color</p>
                            <div className="grid grid-cols-2 gap-2 mt-1.5">
                              <div>
                                <Label htmlFor="gradient-start" className="text-xs">Start</Label>
                                <Input
                                  id="gradient-start"
                                  type="color"
                                  value={tempCustomStyles.gradientStart || "#667eea"}
                                  onChange={(e) => {
                                    const start = e.target.value;
                                    const end = tempCustomStyles.gradientEnd || "#764ba2";
                                    const gradient = `linear-gradient(135deg, ${start}, ${end})`;
                                    setTempCustomStyles({
                                      ...tempCustomStyles,
                                      gradientStart: start,
                                      gradientEnd: end,
                                      gradient,
                                      backgroundGradient: gradient
                                    });
                                  }}
                                  className="w-full h-10 mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="gradient-end" className="text-xs">End</Label>
                                <Input
                                  id="gradient-end"
                                  type="color"
                                  value={tempCustomStyles.gradientEnd || "#764ba2"}
                                  onChange={(e) => {
                                    const start = tempCustomStyles.gradientStart || "#667eea";
                                    const end = e.target.value;
                                    const gradient = `linear-gradient(135deg, ${start}, ${end})`;
                                    setTempCustomStyles({
                                      ...tempCustomStyles,
                                      gradientStart: start,
                                      gradientEnd: end,
                                      gradient,
                                      backgroundGradient: gradient
                                    });
                                  }}
                                  className="w-full h-10 mt-1"
                                />
                              </div>
                            </div>
                            {tempCustomStyles.gradient && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setTempCustomStyles({ ...tempCustomStyles, gradient: '', backgroundGradient: '', gradientStart: '', gradientEnd: '' })}
                                className="w-full mt-2 text-xs"
                              >
                                Clear Gradient
                              </Button>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="background-image" className="text-sm">Background Image</Label>
                            <p className="text-xs text-muted-foreground mb-2">Upload a custom background</p>
                            <input
                              ref={bgImageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                if (!file.type.startsWith('image/')) {
                                  toast.error("Please upload an image file");
                                  return;
                                }

                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("Image must be less than 5MB");
                                  return;
                                }

                                setLoading(true);
                                try {
                                  const { data: { user } } = await supabase.auth.getUser();
                                  if (!user) throw new Error("Not authenticated");

                                  const fileExt = file.name.split('.').pop();
                                  const fileName = `bg-${Date.now()}.${fileExt}`;
                                  const filePath = `${user.id}/${fileName}`;

                                  const { error: uploadError } = await supabase.storage
                                    .from('avatars')
                                    .upload(filePath, file, { upsert: true });

                                  if (uploadError) throw uploadError;

                                  const { data: { publicUrl } } = supabase.storage
                                    .from('avatars')
                                    .getPublicUrl(filePath);

                                  setTempCustomStyles({
                                    ...tempCustomStyles,
                                    backgroundImage: publicUrl
                                  });
                                  toast.success("Background image uploaded!");
                                } catch (error: any) {
                                  console.error("Upload error:", error);
                                  toast.error(error.message || "Failed to upload image");
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => bgImageInputRef.current?.click()}
                                className="w-full"
                                size="sm"
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                {tempCustomStyles.backgroundImage ? "Change Background" : "Upload Background"}
                              </Button>
                              {tempCustomStyles.backgroundImage && (
                                <>
                                  <div
                                    className="h-24 rounded-lg bg-cover bg-center"
                                    style={{ backgroundImage: `url(${tempCustomStyles.backgroundImage})` }}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setTempCustomStyles({ ...tempCustomStyles, backgroundImage: undefined })}
                                    className="w-full"
                                  >
                                    Remove Background
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="button-color" className="text-sm">Button Background Color</Label>
                            <div className="flex gap-3 items-center mt-1.5">
                              <Input
                                id="button-color"
                                type="color"
                                value={tempCustomStyles.buttonColor || "#000000"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, buttonColor: e.target.value })}
                                className="w-20 h-10"
                              />
                              <Input
                                type="text"
                                value={tempCustomStyles.buttonColor || "#000000"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, buttonColor: e.target.value })}
                                placeholder="#000000"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="button-text-color" className="text-sm">Button Text Color</Label>
                            <div className="flex gap-3 items-center mt-1.5">
                              <Input
                                id="button-text-color"
                                type="color"
                                value={tempCustomStyles.buttonTextColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, buttonTextColor: e.target.value })}
                                className="w-20 h-10"
                              />
                              <Input
                                type="text"
                                value={tempCustomStyles.buttonTextColor || "#FFFFFF"}
                                onChange={(e) => setTempCustomStyles({ ...tempCustomStyles, buttonTextColor: e.target.value })}
                                placeholder="#FFFFFF"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="button-variant" className="text-sm">Button Style</Label>
                            <Select
                              value={tempCustomStyles.buttonVariant || "solid"}
                              onValueChange={(val) => setTempCustomStyles({ ...tempCustomStyles, buttonVariant: val })}
                            >
                              <SelectTrigger id="button-variant" className="w-full mt-1.5">
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="outline">Outline</SelectItem>
                                <SelectItem value="glass">Glass</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                      </div>
                    </div>
                  </div>
              </Card>
            </div>
          )}

          {editMode && (
            <div className="sticky top-20 self-start w-full">
              <div className="h-[calc(100vh-6rem)] overflow-auto">
                <PublicKit data={(() => {
                  const previewKit = {
                    ...mediaKit,
                    ...editData,
                    social_stats: socialHandles.reduce((acc: any, h) => {
                      acc[h.platform] = {
                        username: h.username,
                        followers: h.followerCount,
                        followerCount: h.followerCount
                      };
                      return acc;
                    }, {}),
                    custom_styles: {
                      ...tempCustomStyles,
                      sectionStyles
                    },
                    rates,
                    documents,
                    clients
                  };
                  return mapKitToPublicData(previewKit, { preferSnapshot: false });
                })()} />
              </div>
            </div>
          )}

          {!editMode && (
            <div className="space-y-8">
              <Card
                className={`text-center ${getSectionCardClasses()} ${!editMode && hasCustomStyles ? '' : templateStyle.text}`}
                style={!editMode && hasCustomStyles ? {
                  ...getSectionCardStyle(),
                  color: customStyles.secondaryColor
                } : {}}
              >
                <div className="relative inline-block mb-4">
                  {editData?.avatar_url || mediaKit?.avatar_url ? (
                    <img
                      src={editData?.avatar_url || mediaKit.avatar_url}
                      alt={editData?.name || mediaKit?.name || formData.name || "Profile"}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold ${hasCustomStyles ? '' : 'bg-accent'}`}
                      style={hasCustomStyles ? { backgroundColor: customStyles.accentColor, color: customStyles.secondaryColor } : {}}
                    >
                      {String(editData?.name || mediaKit?.name || formData.name || 'A').charAt(0)}
                    </div>
                  )}
                </div>

                <h1
                  className={`text-3xl font-bold mb-3 ${!hasCustomStyles ? 'text-foreground' : ''}`}
                  style={hasCustomStyles ? {
                    fontFamily: customStyles.fontFamily,
                    color: customStyles.secondaryColor || undefined
                  } : {}}
                >
                  {editData?.name || mediaKit?.name || formData.name || "Your Name"}
                </h1>

                {(() => {
                  const socialData = (mediaKit?.social_stats || mediaKit?.social_data) as SocialBundle | any;
                  const platforms: Array<{platform: string, Icon: any, username: string}> = [];

                  const getIcon = (platform: string) => {
                    const icons: Record<string, any> = {
                      instagram: Instagram,
                      youtube: Youtube,
                      tiktok: Music,
                      twitter: Twitter,
                      facebook: Facebook,
                      linkedin: Linkedin,
                      twitch: Twitch,
                      snapchat: Camera,
                      pinterest: Pin,
                      threads: AtSign
                    };
                    return icons[String(platform || '').toLowerCase()] || AtSign;
                  };

                  const getDisplayName = (platform: string) => {
                    const names: Record<string, string> = {
                      instagram: 'Instagram',
                      youtube: 'YouTube',
                      tiktok: 'TikTok',
                      twitter: 'Twitter/X',
                      facebook: 'Facebook',
                      linkedin: 'LinkedIn',
                      twitch: 'Twitch',
                      snapchat: 'Snapchat',
                      pinterest: 'Pinterest',
                      threads: 'Threads'
                    };
                    return names[String(platform || '').toLowerCase()] || platform;
                  };

                  const cleanUsername = (input: string): string => {
                    if (!input) return '';

                    let cleaned = input
                      .replace(/^https?:\/\/(www\.)?/, '')
                      .replace(/^(instagram|tiktok|youtube|twitter|facebook|linkedin|twitch|snapchat|pinterest|threads)\.com\//, '')
                      .replace(/^in\//, '')
                      .replace(/^\/@/, '')
                      .replace(/^@/, '')
                      .replace(/\/$/, '');

                    const parts = cleaned.split('/');
                    cleaned = parts[0];

                    return cleaned;
                  };

                  Object.entries(socialData || {}).forEach(([platform, value]: [string, any]) => {
                    if (value) {
                      let username = '';
                      if (typeof value === 'string') {
                        username = value;
                      } else if (typeof value === 'object') {
                        if (value.username && typeof value.username === 'string') {
                          username = value.username;
                        } else if (value.id && typeof value.id === 'string' && !value.id.match(/^\d+$/)) {
                          username = value.id;
                        }
                      }

                      if (username && !username.match(/^\d+$/)) {
                        platforms.push({
                          platform: getDisplayName(platform),
                          Icon: getIcon(platform),
                          username
                        });
                      }
                    }
                  });

                  return platforms.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                      {platforms.map(({ platform, Icon, username }) => {
                        const cleanedUsername = cleanUsername(username);
                        return (
                          <div
                            key={platform}
                            className={`flex items-center gap-2 text-base ${hasCustomStyles ? '' : templateStyle.accent}`}
                            style={hasCustomStyles ? { color: customStyles.secondaryColor } : {}}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">@{cleanedUsername}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                
                <p
                  className={`text-base leading-relaxed max-w-2xl mx-auto ${hasCustomStyles ? '' : templateStyle.accent}`}
                  style={hasCustomStyles ? { color: customStyles.secondaryColor, fontFamily: customStyles.fontFamily } : {}}
                >
                  {mediaKit?.bio || formData.bio || "Your bio will appear here"}
                </p>
              </Card>

              {(editData?.ai_summary || aiSummary) && (
                <Card
                  className={getSectionCardClasses()}
                  style={hasCustomStyles ? {
                    ...getSectionCardStyle(),
                    color: customStyles.secondaryColor
                  } : {}}
                >
                  <h2
                    className={`text-2xl font-bold mb-4 ${hasCustomStyles ? '' : templateStyle.text}`}
                    style={hasCustomStyles ? { fontFamily: customStyles.fontFamily, color: customStyles.secondaryColor } : {}}
                  >
                    Summary
                  </h2>
                  <p
                    className={`text-base leading-relaxed ${hasCustomStyles ? '' : templateStyle.accent}`}
                    style={hasCustomStyles ? { color: customStyles.secondaryColor, fontFamily: customStyles.fontFamily } : {}}
                  >
                    {editData?.ai_summary || aiSummary}
                  </p>
                </Card>
              )}

              {socialHandles.length > 0 && (
                <div className="space-y-4">
                  {socialHandles.map((handle) => {
                    const stats = mediaKit?.social_stats?.[handle.platform] || {};
                    const isManual = handle.manualEntry || stats.manualEntry === true;

                    return (
                      <SocialCard
                        key={`${handle.platform}-${handle.username}`}
                        isManual={isManual}
                        customStyles={hasCustomStyles ? customStyles : undefined}
                        stats={{
                          platform: handle.platform as any,
                          id: stats.id || handle.username || '',
                          username: stats.username || handle.username || null,
                          display_name: stats.display_name || null,
                          avatar_url: stats.avatar_url || null,
                          followers: stats.followers || stats.followerCount || handle.followerCount || null,
                          following: stats.following || null,
                          posts: stats.posts || null,
                          views: stats.views || null,
                          engagement_rate: stats.engagement_rate || null,
                          avg_likes: stats.avg_likes || null,
                          avg_comments: stats.avg_comments || null
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {((socialHandles.length > 0 && socialHandles.some(h => h.followerCount)) || mediaKit?.followers_total > 0 || mediaKit?.avg_engagement_rate > 0) && (
                <Card
                  className={getSectionCardClasses()}
                  style={hasCustomStyles ? {
                    ...getSectionCardStyle(),
                    color: customStyles.secondaryColor
                  } : {}}
                >
                  <h2
                    className={`text-2xl font-bold mb-6 ${hasCustomStyles ? '' : templateStyle.text}`}
                    style={hasCustomStyles ? { fontFamily: customStyles.fontFamily, color: customStyles.secondaryColor } : {}}
                  >
                    Audience Statistics
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(() => {
                      const followerTotal = socialHandles.reduce((sum, h) => sum + (h.followerCount || 0), 0) || mediaKit?.followers_total || 0;
                      return followerTotal > 0 && (
                        <div>
                          <p
                            className={`text-sm mb-1 ${hasCustomStyles ? 'opacity-70' : templateStyle.accent}`}
                            style={hasCustomStyles ? { color: customStyles.secondaryColor } : {}}
                          >
                            Total Followers
                          </p>
                          <p className="text-3xl font-bold" style={hasCustomStyles ? { color: customStyles.secondaryColor } : {}}>
                            {Number(followerTotal).toLocaleString()}
                          </p>
                        </div>
                      );
                    })()}
                    {mediaKit?.avg_engagement_rate > 0 && (
                      <div>
                        <p
                          className={`text-sm mb-1 ${hasCustomStyles ? 'opacity-70' : templateStyle.accent}`}
                          style={hasCustomStyles ? { color: customStyles.secondaryColor } : {}}
                        >
                          Engagement Rate
                        </p>
                        <p className="text-3xl font-bold" style={hasCustomStyles ? { color: customStyles.secondaryColor } : {}}>
                          {mediaKit.avg_engagement_rate.toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {(editData?.email || mediaKit?.email) && (
                <Card
                  className={`text-center ${getSectionCardClasses()}`}
                  style={hasCustomStyles ? {
                    ...getSectionCardStyle(),
                    color: customStyles.secondaryColor
                  } : {}}
                >
                  <h2
                    className={`text-2xl font-bold mb-4 ${hasCustomStyles ? '' : templateStyle.text}`}
                    style={hasCustomStyles ? { fontFamily: customStyles.fontFamily, color: customStyles.secondaryColor } : {}}
                  >
                    Let's Work Together
                  </h2>
                  <p
                    className={`mb-6 ${hasCustomStyles ? 'opacity-70' : templateStyle.accent}`}
                    style={hasCustomStyles ? { color: customStyles.secondaryColor, fontFamily: customStyles.fontFamily } : {}}
                  >
                    Interested in collaboration? Get in touch!
                  </p>
                  <a
                    href={`mailto:${editData?.email || mediaKit?.email}`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-soft"
                  >
                    <Mail className="h-5 w-5" />
                    Contact Me
                  </a>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Editor;
