import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AuthHeader from "@/components/AuthHeader";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast as sonnerToast } from "sonner";

const CreateMediaKit = () => {
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      sonnerToast.error("You must be logged in to create a media kit");
      return;
    }

    setLoading(true);

    try {
      // Generate a unique URL slug from the title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      // Prepare social data
      const socialData = {
        instagram: formData.instagram ? { handle: formData.instagram } : null,
        tiktok: formData.tiktok ? { handle: formData.tiktok } : null,
        youtube: formData.youtube ? { channel: formData.youtube } : null,
      };

      // Insert the media kit into the database
      const { data, error } = await supabase
        .from('media_kits')
        .insert({
          user_id: user.id,
          name: formData.title,
          bio: formData.bio,
          public_url_slug: slug,
          social_data: socialData,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      sonnerToast.success("Media kit created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating media kit:", error);
      sonnerToast.error(error.message || "Failed to create media kit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Create Your Media Kit</h1>
          <p className="text-muted-foreground mb-8">
            Template: {template || "default"}
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Media Kit Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fashion & Lifestyle Creator"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell brands about yourself..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok Handle</Label>
                  <Input
                    id="tiktok"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube Channel</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="Channel name"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Media Kit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateMediaKit;
