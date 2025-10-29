import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
              <li><a href="mailto:alex@trycreators.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Platforms</h3>
            <ul className="space-y-2">
              <li><Link to="/platforms/instagram" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</Link></li>
              <li><Link to="/platforms/tiktok" className="text-sm text-muted-foreground hover:text-foreground transition-colors">TikTok</Link></li>
              <li><Link to="/platforms/youtube" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</Link></li>
              <li><Link to="/platforms/twitter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</Link></li>
              <li><Link to="/platforms/facebook" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Facebook</Link></li>
              <li><Link to="/platforms/snapchat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Snapchat</Link></li>
              <li><Link to="/platforms/telegram" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Telegram</Link></li>
              <li><Link to="/platforms/threads" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Threads</Link></li>
              <li><Link to="/platforms/whatsapp" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Free Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/influencer-rate-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Influencer Rate Calculator</Link></li>
              <li><Link to="/tools/engagement-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Engagement Calculator</Link></li>
              <li><Link to="/tools/roi-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ROI Calculator</Link></li>
              <li><Link to="/tools/audience-demographics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Audience Demographics</Link></li>
              <li><Link to="/tools/campaign-tracker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Campaign Tracker</Link></li>
              <li><Link to="/tools/content-planner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Content Planner</Link></li>
              <li><Link to="/tools/hashtag-generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hashtag Generator</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Works App, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
