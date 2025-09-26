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
        <Link to="/" className="flex items-center space-x-2 group">
          <img src={logo} alt="Creators" className="h-8" />
          <span className="text-muted-foreground font-semibold text-2xl">200</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            Leaderboard
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            About
          </Link>
        </nav>

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
                Leaderboard
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}