import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";

export default function InfluencerFinder() {
  const topInfluencers = [
    {
      name: "MrBeast",
      platform: "YouTube",
      followers: "224M",
      engagement: "8.2%",
      category: "Entertainment",
      verified: true
    },
    {
      name: "Kylie Jenner",
      platform: "Instagram", 
      followers: "400M",
      engagement: "1.8%",
      category: "Lifestyle",
      verified: true
    },
    {
      name: "Charli D'Amelio",
      platform: "TikTok",
      followers: "151M",
      engagement: "4.5%",
      category: "Dance",
      verified: true
    },
    {
      name: "PewDiePie",
      platform: "YouTube",
      followers: "111M",
      engagement: "6.7%",
      category: "Gaming",
      verified: true
    },
    {
      name: "Addison Rae",
      platform: "TikTok",
      followers: "88M",
      engagement: "3.2%",
      category: "Dance",
      verified: true
    },
    {
      name: "Dude Perfect",
      platform: "YouTube",
      followers: "60M",
      engagement: "9.1%",
      category: "Sports",
      verified: true
    }
  ];

  const categories = [
    { name: "Beauty & Fashion", count: "2.1M influencers", color: "bg-pink-100 text-pink-800" },
    { name: "Gaming", count: "1.8M influencers", color: "bg-purple-100 text-purple-800" },
    { name: "Food & Cooking", count: "1.5M influencers", color: "bg-orange-100 text-orange-800" },
    { name: "Fitness & Health", count: "1.3M influencers", color: "bg-green-100 text-green-800" },
    { name: "Travel", count: "900K influencers", color: "bg-blue-100 text-blue-800" },
    { name: "Technology", count: "750K influencers", color: "bg-gray-100 text-gray-800" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Influencer Finder</h1>
        <p className="text-gray-700 mb-8">Discover top influencers across different platforms and categories to find the perfect match for your brand collaborations.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">50M+</CardTitle>
              <CardDescription>Active Influencers</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">500+</CardTitle>
              <CardDescription>Categories</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">99%</CardTitle>
              <CardDescription>Match Accuracy</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                    <Badge className={category.color}>
                      Popular
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Influencers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInfluencers.map((influencer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{influencer.name}</CardTitle>
                    {influencer.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span className="font-medium">{influencer.platform}</span>
                    <span>•</span>
                    <span>{influencer.category}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Followers</span>
                      <span className="font-semibold">{influencer.followers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Engagement</span>
                      <span className="font-semibold text-green-600">{influencer.engagement}</span>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline" className="w-full justify-center">
                        View Profile
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Find Your Perfect Influencer?</h2>
            <p className="text-gray-700 mb-6">
              Our advanced search filters help you discover influencers based on location, audience demographics, 
              engagement rates, and content categories. Start building meaningful partnerships today.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Direct Contact</h3>
                <p className="text-sm text-gray-600">Connect directly with influencers</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Track campaign performance</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Audience Insights</h3>
                <p className="text-sm text-gray-600">Detailed audience demographics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4">
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
                <li><Link to="/tools/influencer-finder" className="text-gray-600 hover:text-primary transition-colors">Influencer Finder</Link></li>
                <li><Link to="/tools/roi-calculator" className="text-gray-600 hover:text-primary transition-colors">ROI Calculator</Link></li>
                <li><Link to="/tools/growth-tracker" className="text-gray-600 hover:text-primary transition-colors">Growth Tracker</Link></li>
                <li><Link to="/tools/brand-mention-tracker" className="text-gray-600 hover:text-primary transition-colors">Brand Mention Tracker</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://discord.gg/Cet49cDcSr" 
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
}