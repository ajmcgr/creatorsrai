import { Button } from "@/components/ui/button";
import { LogOut, Zap, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/creators-logo-full.png";

interface AuthHeaderProps {
  showUpgrade?: boolean;
  showSettings?: boolean;
  showReturnToDashboard?: boolean;
}

const AuthHeader = ({ showUpgrade = false, showSettings = false, showReturnToDashboard = true }: AuthHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Best-effort local sign-out (avoids 403 from global revoke)
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.error('signOut local error:', err);
    }

    // Hard clear any persisted Supabase auth tokens
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('sb-') || k.startsWith('supabase.')) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.error('localStorage clear error:', e);
    }

    // Full reload to reset app state and AuthContext
    window.location.assign('/auth');
  };

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Creators" className="h-8" />
          </Link>
          {showReturnToDashboard && (
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              Return to Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {showUpgrade && (
            <Button variant="ghost" asChild>
              <Link to="/upgrade">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade
              </Link>
            </Button>
          )}
          {showSettings && (
            <Button variant="ghost" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          )}
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AuthHeader;
