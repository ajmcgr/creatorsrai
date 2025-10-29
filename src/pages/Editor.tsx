import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EditorWithPreview } from "@/components/EditorWithPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import logo from "@/assets/creators-logo-full.png";

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
        <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-full px-6 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Creators" className="h-8" />
            </Link>
          </div>
        </nav>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading media kit...</p>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-full px-6 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Creators" className="h-8" />
            </Link>
          </div>
        </nav>
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

  const publicUrl = kit.public_url_slug ? `/kit/${kit.public_url_slug}` : '';

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Creators" className="h-8" />
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return to Dashboard
            </Link>
          </div>
          {publicUrl && (
            <Button variant="outline" asChild>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live
              </a>
            </Button>
          )}
        </div>
      </nav>
      <EditorWithPreview kit={kit} onSave={loadKit} />
    </div>
  );
};

export default Editor;
