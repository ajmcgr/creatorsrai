import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 group">
          <img src={logo} alt="Creators" className="h-8" />
          <span className="font-reckless font-semibold text-xl" style={{ color: "#6b7280" }}>200</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Ranking
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              to="/updates" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Updates
            </Link>
          </nav>
          
          {/* Product Hunt Badge */}
          <a 
            href="https://www.producthunt.com/products/creators-leaderboard?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-creators%E2%80%94200" 
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1019497&theme=light&t=1759139445174" 
              alt="Creators 200 - Forbes List for Creators | Product Hunt" 
              className="w-[200px] h-[43px]"
              width="200" 
              height="43" 
            />
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border/50 shadow-lg">
          <nav className="container mx-auto px-4 py-4 max-w-5xl">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ranking
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/updates" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Updates
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}