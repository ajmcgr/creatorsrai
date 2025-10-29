import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Settings, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import creatorsLogo from "@/assets/creators-logo.png";

const AuthHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={creatorsLogo} alt="Creators Logo" className="h-8" />
        </Link>
        
        <div className="flex items-center gap-3">
          <Link to="/upgrade">
            <Button variant="ghost" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
