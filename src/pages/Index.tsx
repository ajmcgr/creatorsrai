import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Leaderboard } from "@/components/Leaderboard";
import "@/utils/refreshData.js";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            World's Most Popular Creators - Real-time Leaderboard
          </h2>
          <p className="text-gray-600">
            Real-time leaderboard showing the most followed creators across platforms (
            <Link to="/about" className="text-primary underline hover:no-underline">learn more</Link>
            )
          </p>
        </div>
        
        <Leaderboard />
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">How often is the leaderboard updated?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  The leaderboard refreshes once per week by default, pulling directly from Social Blade's official creator rankings. This ensures you're seeing accurate, consistent data without burning through unnecessary API credits.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">How do you verify the information?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  All numbers (subscribers, followers, views) come directly from the Social Blade Business API, which tracks creators across YouTube, TikTok, and Instagram. We don't manually edit or inflate any figures — everything you see is what Social Blade reports.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">Which platforms are included?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  Right now, we focus on the three biggest creator ecosystems: YouTube, TikTok, and Instagram. More platforms (Twitch, Facebook, X) may be added later depending on demand.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">Why only the Top 100?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  The Social Blade API provides results in pages of 100. For simplicity and cost-efficiency, we display the top page (the 100 biggest creators per platform).
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">Can I suggest a creator or channel to add?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  The rankings come straight from Social Blade's data, so you can't "submit" someone to appear. If a creator is active and large enough, they'll naturally show up in Social Blade's top lists.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">Why isn't [creator name] on the list?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  Two common reasons:
                  <br /><br />
                  They may not be in the global Top 100 for their platform.
                  <br /><br />
                  Their account might not be tracked or ranked publicly by Social Blade yet.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900">Who is behind this leaderboard?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  This site was built by Works.xyz, a creative PR and influence platform. We use Social Blade's Business API to power the data, but the design and presentation are our own.
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Free Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/tools/engagement-calculator" className="text-gray-600 hover:text-primary transition-colors">Engagement Calculator</Link></li>
                <li><Link to="/tools/hashtag-generator" className="text-gray-600 hover:text-primary transition-colors">Hashtag Generator</Link></li>
                <li><Link to="/tools/content-planner" className="text-gray-600 hover:text-primary transition-colors">Content Planner</Link></li>
                <li><Link to="/tools/influencer-rate-calculator" className="text-gray-600 hover:text-primary transition-colors">Influencer Rate Calculator</Link></li>
                <li><Link to="/tools/roi-calculator" className="text-gray-600 hover:text-primary transition-colors">ROI Calculator</Link></li>
                <li><Link to="/tools/audience-demographics" className="text-gray-600 hover:text-primary transition-colors">Audience Demographics</Link></li>
                <li><Link to="/tools/campaign-tracker" className="text-gray-600 hover:text-primary transition-colors">Campaign Tracker</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://discord.gg/zH5GjPDT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a 
                    href="http://x.com/alexmacgregor__/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:alex@creatorsleaderboard.com" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center">
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
        </div>
      </footer>
    </div>
  );
};

export default Index;
