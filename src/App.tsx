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
import ChooseTemplate from "./pages/ChooseTemplate";
import CreateMediaKit from "./pages/CreateMediaKit";
import Editor from "./pages/Editor";
import PublicKit from "./pages/PublicKit";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Upgrade from "./pages/Upgrade";
import Analytics from "./pages/Analytics";
import Instagram from "./pages/platforms/Instagram";
import TikTok from "./pages/platforms/TikTok";
import YouTube from "./pages/platforms/YouTube";
import Facebook from "./pages/platforms/Facebook";
import Twitter from "./pages/platforms/Twitter";
import Snapchat from "./pages/platforms/Snapchat";
import Telegram from "./pages/platforms/Telegram";
import Threads from "./pages/platforms/Threads";
import WhatsApp from "./pages/platforms/WhatsApp";
import InfluencerRateCalculator from "./pages/tools/InfluencerRateCalculator";
import EngagementCalculator from "./pages/tools/EngagementCalculator";
import ROICalculator from "./pages/tools/ROICalculator";
import AudienceDemographics from "./pages/tools/AudienceDemographics";
import CampaignTracker from "./pages/tools/CampaignTracker";
import ContentPlanner from "./pages/tools/ContentPlanner";
import HashtagGenerator from "./pages/tools/HashtagGenerator";
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
          <Route path="/auth/callback" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/choose-template" element={<ChooseTemplate />} />
          <Route path="/create-media-kit" element={<CreateMediaKit />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/kit/:slug" element={<PublicKit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Platform Pages */}
          <Route path="/platforms/instagram" element={<Instagram />} />
          <Route path="/platforms/tiktok" element={<TikTok />} />
          <Route path="/platforms/youtube" element={<YouTube />} />
          <Route path="/platforms/facebook" element={<Facebook />} />
          <Route path="/platforms/twitter" element={<Twitter />} />
          <Route path="/platforms/snapchat" element={<Snapchat />} />
          <Route path="/platforms/telegram" element={<Telegram />} />
          <Route path="/platforms/threads" element={<Threads />} />
          <Route path="/platforms/whatsapp" element={<WhatsApp />} />
          
          {/* Tool Pages */}
          <Route path="/tools/influencer-rate-calculator" element={<InfluencerRateCalculator />} />
          <Route path="/tools/engagement-calculator" element={<EngagementCalculator />} />
          <Route path="/tools/roi-calculator" element={<ROICalculator />} />
          <Route path="/tools/audience-demographics" element={<AudienceDemographics />} />
          <Route path="/tools/campaign-tracker" element={<CampaignTracker />} />
          <Route path="/tools/content-planner" element={<ContentPlanner />} />
          <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/:username" element={<PublicKit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
