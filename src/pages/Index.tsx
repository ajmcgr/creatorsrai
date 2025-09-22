import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Leaderboard } from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold mb-2">
            Current Rankings
          </h2>
          <p className="text-muted-foreground">
            Real-time leaderboard showing the most followed creators across platforms
          </p>
        </div>
        
        <Leaderboard />
      </main>
      
      <footer className="border-t bg-secondary/30 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 RankedPeople. Data provided by Social Blade API.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
