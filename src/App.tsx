import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Instagram from "./pages/platforms/Instagram";
import TikTok from "./pages/platforms/TikTok";
import YouTube from "./pages/platforms/YouTube";
import Facebook from "./pages/platforms/Facebook";
import Twitter from "./pages/platforms/Twitter";
import InfluencerRateCalculator from "./pages/tools/InfluencerRateCalculator";
import EngagementCalculator from "./pages/tools/EngagementCalculator";
import ROICalculator from "./pages/tools/ROICalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Platform Pages */}
          <Route path="/platforms/instagram" element={<Instagram />} />
          <Route path="/platforms/tiktok" element={<TikTok />} />
          <Route path="/platforms/youtube" element={<YouTube />} />
          <Route path="/platforms/facebook" element={<Facebook />} />
          <Route path="/platforms/twitter" element={<Twitter />} />
          
          {/* Tool Pages */}
          <Route path="/tools/influencer-rate-calculator" element={<InfluencerRateCalculator />} />
          <Route path="/tools/engagement-calculator" element={<EngagementCalculator />} />
          <Route path="/tools/roi-calculator" element={<ROICalculator />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
