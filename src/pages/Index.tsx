import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold mb-2 text-gray-900">
            Current Rankings
          </h2>
          <p className="text-gray-600">
            Real-time leaderboard showing the most followed creators across platforms
          </p>
        </div>
        
        <Leaderboard />
      </main>
      
      <footer className="border-t bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Copyright © 2025 Works App, Inc. Built with ♥️ by{" "}
            <a 
              href="https://works.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Works
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
