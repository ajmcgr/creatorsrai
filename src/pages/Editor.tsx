import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EditorWithPreview } from "@/components/EditorWithPreview";
import AuthHeader from "@/components/AuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const kitId = searchParams.get("kit_id");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kit, setKit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!kitId) {
      setError("No media kit ID provided");
      setLoading(false);
      return;
    }

    loadKit();
  }, [kitId, user, navigate]);

  const loadKit = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("media_kits")
        .select("*")
        .eq("id", kitId)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError("Media kit not found or you don't have access to it");
        setLoading(false);
        return;
      }

      setKit(data);
    } catch (err: any) {
      console.error("Error loading media kit:", err);
      setError(err.message || "Failed to load media kit");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthHeader showSettings showUpgrade />
        <div className="container mx-auto py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading media kit...</p>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="min-h-screen bg-background">
        <AuthHeader showSettings showUpgrade />
        <div className="container mx-auto py-12 max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || "The page you're looking for doesn't exist or you don't have access to it."}
              </p>
              <Link to="/create-media-kit">
                <Button>Create New Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader showSettings showUpgrade />
      <EditorWithPreview kit={kit} onSave={loadKit} />
    </div>
  );
};

export default Editor;
