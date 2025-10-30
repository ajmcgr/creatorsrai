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
      // Clear local session first
      await supabase.auth.signOut({ scope: 'local' });
      
      // Force navigation and page reload
      window.location.href = "/";
    } catch (err: any) {
      console.error("Logout exception:", err);
      // Even if there's an error, clear local storage and redirect
      localStorage.clear();
      window.location.href = "/";
    }
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
