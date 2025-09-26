import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Leaderboard } from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-reckless font-medium mb-2 text-gray-900">
            The World's Most Popular Creators Ranked
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Real-time ranking showing the most followed creators across platforms (
            <Link to="/about" className="text-primary underline hover:no-underline">learn more</Link>
            )
          </p>
          
          {/* Bookmark Section */}
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              {/* Chrome Bookmark Icon */}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path 
                  d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" 
                  fill="currentColor"
                />
              </svg>
              <span>
                Bookmark this page: 
                <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white border border-gray-300 rounded font-mono text-gray-600 shadow-sm">
                  Ctrl+D
                </kbd>
                <span className="text-gray-400 mx-1">•</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-white border border-gray-300 rounded font-mono text-gray-600 shadow-sm">
                  ⌘+D
                </kbd>
              </span>
            </div>
          </div>
        </div>
        
        <Leaderboard />
        
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-reckless font-medium mb-6 sm:mb-8 text-gray-900">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">How often is the ranking updated?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  The ranking refreshes once per week by default, pulling directly from official creator ranking data.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">How do you verify the information?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  All numbers (subscribers, followers, views) come directly from official APIs that track creators across YouTube, TikTok, and Instagram. We don't manually edit or inflate any figures — everything you see is authentic data.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Which platforms are included?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  Right now, we focus on the three biggest creator ecosystems: YouTube, TikTok, and Instagram. More platforms (Twitch, Facebook, X) may be added later depending on demand.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Why only the Top 200?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  Our data sources provide results in pages of 100. We fetch and merge the first two pages to display the top 200 biggest creators per platform.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Can I suggest a creator or channel to add?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  The ranking comes straight from official data sources, so you can't "submit" someone to appear. If a creator is active and large enough, they'll naturally show up in the top lists.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Why isn't [creator name] on the list?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  Two common reasons:
                  <br /><br />
                  They may not be in the global Top 200 for their platform.
                  <br /><br />
                  Their account might not be tracked or ranked publicly yet.
                </div>
              </details>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Who is behind this ranking?</span>
                  <span className="text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                  This site was built by <a href="https://x.com/Creators200" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alex</a> and Works.xyz, a creative PR and influence platform. We use official APIs to power the data, but the design and presentation are our own.
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Free Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/tools/engagement-calculator" className="text-gray-600 hover:text-primary transition-colors text-sm">Engagement Calculator</Link></li>
                <li><Link to="/tools/hashtag-generator" className="text-gray-600 hover:text-primary transition-colors text-sm">Hashtag Generator</Link></li>
                <li><Link to="/tools/content-planner" className="text-gray-600 hover:text-primary transition-colors text-sm">Content Planner</Link></li>
                <li><Link to="/tools/influencer-rate-calculator" className="text-gray-600 hover:text-primary transition-colors text-sm">Influencer Rate Calculator</Link></li>
                <li><Link to="/tools/roi-calculator" className="text-gray-600 hover:text-primary transition-colors text-sm">ROI Calculator</Link></li>
                <li><Link to="/tools/audience-demographics" className="text-gray-600 hover:text-primary transition-colors text-sm">Audience Demographics</Link></li>
                <li><Link to="/tools/campaign-tracker" className="text-gray-600 hover:text-primary transition-colors text-sm">Campaign Tracker</Link></li>
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
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/Creators200" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:alex@creatorsleaderboard.com" 
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 text-center">
            <p className="text-sm text-gray-600">
              Copyright © 2025 Works App, Inc. Built with ♥️ by{" "}
              <a 
                href="https://x.com/alexmacgregor__" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Alex
              </a>
              {" "}and{" "}
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
