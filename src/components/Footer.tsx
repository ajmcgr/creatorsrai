import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/influencer-rate-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rate Calculator</Link></li>
              <li><Link to="/tools/engagement-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Engagement Calculator</Link></li>
              <li><Link to="/tools/roi-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ROI Calculator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Platforms</h3>
            <ul className="space-y-2">
              <li><Link to="/platforms/instagram" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</Link></li>
              <li><Link to="/platforms/tiktok" className="text-sm text-muted-foreground hover:text-foreground transition-colors">TikTok</Link></li>
              <li><Link to="/platforms/youtube" className="text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://x.com/trycreators" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter/X</a></li>
              <li><a href="mailto:alex@trycreators.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
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
