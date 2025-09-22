import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Leaderboard } from "@/components/Leaderboard";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2 text-gray-900">
              Current Rankings
            </h2>
            <p className="text-gray-600">
              Real-time leaderboard showing the most followed creators across platforms
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-sm"
          >
            {showAdmin ? 'Hide Admin' : 'Admin'}
          </Button>
        </div>
        
        {showAdmin && (
          <div className="mb-8">
            <AdminPanel />
          </div>
        )}
        
        <Leaderboard />
      </main>
      
      <footer className="border-t bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 RankedPeople Lite. Data provided by Social Blade API.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
