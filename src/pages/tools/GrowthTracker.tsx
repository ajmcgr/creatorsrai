import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle } from "lucide-react";

export default function GrowthTracker() {
  const sampleData = [
    {
      platform: "Instagram",
      followers: 45230,
      growth: "+12.3%",
      trend: "up",
      engagement: "4.2%",
      posts: 156,
      avgLikes: 1890
    },
    {
      platform: "TikTok", 
      followers: 28640,
      growth: "+18.7%",
      trend: "up",
      engagement: "6.8%",
      posts: 89,
      avgLikes: 2340
    },
    {
      platform: "YouTube",
      followers: 12450,
      growth: "-2.1%",
      trend: "down",
      engagement: "8.1%",
      posts: 24,
      avgLikes: 890
    },
    {
      platform: "Twitter",
      followers: 8920,
      growth: "+5.4%",
      trend: "up",
      engagement: "2.3%",
      posts: 234,
      avgLikes: 120
    }
  ];

  const topPosts = [
    {
      platform: "TikTok",
      title: "Morning routine hack",
      views: "2.4M",
      likes: "184K",
      comments: "12.3K",
      engagement: "8.2%"
    },
    {
      platform: "Instagram",
      title: "Behind the scenes setup",
      views: "890K", 
      likes: "45.2K",
      comments: "3.1K",
      engagement: "5.4%"
    },
    {
      platform: "YouTube",
      title: "Complete tutorial series",
      views: "156K",
      likes: "12.8K",
      comments: "892",
      engagement: "8.7%"
    }
  ];

  const growthTips = [
    {
      title: "Consistency is Key",
      description: "Post regularly and maintain a consistent brand voice across all platforms",
      icon: "🎯"
    },
    {
      title: "Engage with Your Audience", 
      description: "Respond to comments and messages to build a loyal community",
      icon: "💬"
    },
    {
      title: "Analyze Peak Times",
      description: "Post when your audience is most active for maximum reach",
      icon: "⏰"
    },
    {
      title: "Cross-Platform Promotion",
      description: "Leverage each platform's strengths to grow your overall presence",
      icon: "🔄"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Growth Tracker</h1>
        <p className="text-gray-700 mb-8">Monitor your social media growth across all platforms and track key performance metrics over time.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">95.2K</CardTitle>
              <CardDescription>Total Followers</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-2xl text-green-600">+8.6%</CardTitle>
              <CardDescription>Overall Growth</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">3.4M</CardTitle>
              <CardDescription>Total Views</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <CardTitle className="text-2xl">242K</CardTitle>
              <CardDescription>Total Likes</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Growth metrics across all your social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{platform.platform.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{platform.platform}</h3>
                        <p className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center ${platform.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {platform.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-semibold">{platform.growth}</span>
                      </div>
                      <p className="text-sm text-gray-600">{platform.engagement} engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best content from the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <Badge variant="secondary">{post.platform}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{post.views}</div>
                        <div className="text-gray-600">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{post.likes}</div>
                        <div className="text-gray-600">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{post.engagement}</div>
                        <div className="text-gray-600">Engagement</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Growth Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthTips.map((tip, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="text-4xl mb-2">{tip.icon}</div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Accelerate Your Growth?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Track your progress, identify what's working, and optimize your content strategy with our comprehensive 
              growth tracking tools. Get detailed analytics, competitor insights, and personalized recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">Monitor your metrics as they happen</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Growth Predictions</h3>
                <p className="text-sm text-gray-600">AI-powered growth forecasting</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Competitor Analysis</h3>
                <p className="text-sm text-gray-600">See how you stack up against competitors</p>
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