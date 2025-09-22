import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import EngagementCalculator from "./pages/tools/EngagementCalculator";
import HashtagGenerator from "./pages/tools/HashtagGenerator";
import ContentPlanner from "./pages/tools/ContentPlanner";
import InfluencerFinder from "./pages/tools/InfluencerFinder";
import ROICalculator from "./pages/tools/ROICalculator";
import GrowthTracker from "./pages/tools/GrowthTracker";
import BrandMentionTracker from "./pages/tools/BrandMentionTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/tools/engagement-calculator" element={<EngagementCalculator />} />
            <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
            <Route path="/tools/content-planner" element={<ContentPlanner />} />
            <Route path="/tools/influencer-finder" element={<InfluencerFinder />} />
            <Route path="/tools/roi-calculator" element={<ROICalculator />} />
            <Route path="/tools/growth-tracker" element={<GrowthTracker />} />
            <Route path="/tools/brand-mention-tracker" element={<BrandMentionTracker />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
