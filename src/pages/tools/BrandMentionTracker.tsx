import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageCircle, AlertCircle, CheckCircle, Clock, Star } from "lucide-react";

export default function BrandMentionTracker() {
  const mentionData = [
    {
      platform: "Twitter",
      mentions: 1247,
      sentiment: "positive",
      change: "+12%",
      trending: true
    },
    {
      platform: "Instagram", 
      mentions: 892,
      sentiment: "positive",
      change: "+8%",
      trending: false
    },
    {
      platform: "TikTok",
      mentions: 634,
      sentiment: "neutral",
      change: "-3%",
      trending: false
    },
    {
      platform: "YouTube",
      mentions: 234,
      sentiment: "positive",
      change: "+15%",
      trending: true
    }
  ];

  const recentMentions = [
    {
      platform: "Twitter",
      author: "@techinfluencer",
      content: "Just tried the new product from @YourBrand and it's amazing! Highly recommend...",
      sentiment: "positive",
      engagement: "234 likes, 45 retweets",
      time: "2 hours ago"
    },
    {
      platform: "Instagram",
      author: "@lifestyle_blogger",
      content: "Loving this collaboration with YourBrand! The quality is incredible and...",
      sentiment: "positive", 
      engagement: "1.2K likes, 89 comments",
      time: "5 hours ago"
    },
    {
      platform: "TikTok",
      author: "@creator_jane",
      content: "Unboxing video of YourBrand's latest release. What do you think?",
      sentiment: "neutral",
      engagement: "45K views, 3.2K likes",
      time: "1 day ago"
    },
    {
      platform: "Twitter",
      author: "@customer_review",
      content: "Had some issues with delivery from @YourBrand but customer service was quick to help",
      sentiment: "neutral",
      engagement: "12 likes, 3 retweets",
      time: "2 days ago"
    }
  ];

  const keyMetrics = {
    totalMentions: 3007,
    positiveSentiment: 78,
    responseRate: 92,
    averageReach: "2.4M"
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4" />;
      case 'negative': return <AlertCircle className="w-4 h-4" />;
      case 'neutral': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Brand Mention Tracker</h1>
        <p className="text-gray-700 mb-8">Monitor brand mentions across social media platforms, track sentiment, and stay on top of your online reputation.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">{keyMetrics.totalMentions.toLocaleString()}</CardTitle>
              <CardDescription>Total Mentions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-2xl text-green-600">{keyMetrics.positiveSentiment}%</CardTitle>
              <CardDescription>Positive Sentiment</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-2xl text-blue-600">{keyMetrics.responseRate}%</CardTitle>
              <CardDescription>Response Rate</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-2xl">{keyMetrics.averageReach}</CardTitle>
              <CardDescription>Average Reach</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>Mentions and sentiment across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentionData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{platform.platform.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{platform.platform}</h3>
                          {platform.trending && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{platform.mentions} mentions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSentimentColor(platform.sentiment)}>
                        {getSentimentIcon(platform.sentiment)}
                        <span className="ml-1 capitalize">{platform.sentiment}</span>
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{platform.change} this week</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Mentions</CardTitle>
              <CardDescription>Latest brand mentions requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMentions.map((mention, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{mention.platform}</Badge>
                        <span className="text-sm font-medium">{mention.author}</span>
                      </div>
                      <Badge className={getSentimentColor(mention.sentiment)}>
                        {getSentimentIcon(mention.sentiment)}
                        <span className="ml-1 capitalize">{mention.sentiment}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{mention.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{mention.engagement}</span>
                      <span>{mention.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reputation Management Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <MessageCircle className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">Respond Quickly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Address mentions within 2-4 hours, especially negative ones. Quick responses show you care about customer feedback.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">Monitor Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track sentiment trends over time to identify potential issues before they escalate into bigger problems.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Star className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">Amplify Positive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Share and engage with positive mentions to amplify good news and show appreciation for your supporters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stay Ahead of Your Brand Reputation</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Get real-time alerts when your brand is mentioned, track sentiment changes, and manage your online 
              reputation proactively. Never miss an important conversation about your brand again.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Real-time Alerts</h3>
                <p className="text-sm text-gray-600">Get notified instantly when your brand is mentioned</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                <p className="text-sm text-gray-600">AI-powered sentiment tracking and analysis</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Response Management</h3>
                <p className="text-sm text-gray-600">Manage all responses from one dashboard</p>
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