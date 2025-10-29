import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <a href="https://blog.works.xyz" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/XtujetsNYy" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:alex@trycreators.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platforms</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/platforms/instagram" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/youtube" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/tiktok" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    TikTok
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/twitter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    X (Twitter)
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/facebook" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/whatsapp" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    WhatsApp
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/telegram" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/threads" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Threads
                  </Link>
                </li>
                <li>
                  <Link to="/platforms/snapchat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Snapchat
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Free Tools</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://trybio.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Link-in-bio Creator ↗
                  </a>
                </li>
                <li>
                  <a href="https://creators200.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Top 200 Creators ↗
                  </a>
                </li>
                <li>
                  <Link to="/tools/engagement-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Engagement Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/tools/hashtag-generator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Hashtag Generator
                  </Link>
                </li>
                <li>
                  <Link to="/tools/content-planner" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Content Planner
                  </Link>
                </li>
                <li>
                  <Link to="/tools/influencer-rate-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Influencer Rate Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/tools/roi-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    ROI Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/tools/audience-demographics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Audience Demographics
                  </Link>
                </li>
                <li>
                  <Link to="/tools/campaign-tracker" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Campaign Tracker
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://x.com/trycreators" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    X
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/XtujetsNYy" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="border-t border-border py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © 2025 Works App, Inc. Built with ♥️ by{" "}
            <a href="https://alexmacgregor.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Alex
            </a>
            {" "}and{" "}
            <a href="https://works.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Works
            </a>.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
