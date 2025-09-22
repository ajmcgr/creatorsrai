import { Crown, Menu, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Crown className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary-glow/30 transition-all duration-300" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl gradient-text">
              RankedPeople
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Social Media Leaderboard
            </p>
          </div>
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
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            About
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}