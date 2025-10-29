import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/creators-logo.png";

const Header = () => {
  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Creators" className="h-8" />
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/upgrade">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/auth">Login</Link>
          </Button>
          <Button asChild className="shadow-soft">
            <Link to="/auth?mode=signup">Sign Up →</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
