import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/src/assets/logo.png" alt="Creators Logo" className="h-8" />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/upgrade" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="/auth">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm">Sign Up →</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
