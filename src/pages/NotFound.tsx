import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
        <p className="mb-4 text-2xl font-semibold">Oops! Page not found</p>
        <p className="mb-8 text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/">
          <Button size="lg">
            Return to Home
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
