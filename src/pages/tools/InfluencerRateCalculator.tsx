import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Users, Eye, TrendingUp } from "lucide-react";

export default function InfluencerRateCalculator() {
  const [platform, setPlatform] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [contentType, setContentType] = useState("");
  const [industry, setIndustry] = useState("");
  const [rates, setRates] = useState<any>(null);

  const platformMultipliers = {
    instagram: { post: 0.01, story: 0.005, reel: 0.015 },
    tiktok: { video: 0.02, live: 0.01 },
    youtube: { video: 0.03, short: 0.01, sponsor: 0.05 },
    twitter: { tweet: 0.005, thread: 0.01 }
  };

  const industryMultipliers = {
    beauty: 1.3,
    fashion: 1.2,
    tech: 1.4,
    fitness: 1.1,
    food: 1.0,
    travel: 1.2,
    lifestyle: 1.0,
    gaming: 1.3
  };

  const calculateRates = () => {
    if (!platform || !followers || !engagement || !contentType || !industry) {
      alert("Please fill in all fields");
      return;
    }

    const followersNum = parseInt(followers) || 0;
    const engagementNum = parseFloat(engagement) || 0;
    const platformData = platformMultipliers[platform as keyof typeof platformMultipliers];
    const industryMultiplier = industryMultipliers[industry as keyof typeof industryMultipliers] || 1;

    if (!platformData) return;

    const baseRate = followersNum * (platformData[contentType as keyof typeof platformData] || 0.01);
    const engagementMultiplier = Math.max(0.5, Math.min(2.0, engagementNum / 3)); // 3% is baseline
    const finalRate = baseRate * engagementMultiplier * industryMultiplier;

    const rateRange = {
      min: Math.round(finalRate * 0.7),
      max: Math.round(finalRate * 1.3),
      suggested: Math.round(finalRate)
    };

    setRates({
      ...rateRange,
      cpm: Math.round((finalRate / (followersNum * (engagementNum / 100))) * 1000),
      tier: getTier(followersNum)
    });
  };

  const getTier = (followers: number) => {
    if (followers < 1000) return "Nano";
    if (followers < 10000) return "Micro";
    if (followers < 100000) return "Mid-tier";
    if (followers < 1000000) return "Macro";
    return "Mega";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-reckless font-medium text-gray-900 mb-4">Influencer Rate Calculator</h1>
        <p className="text-gray-700 mb-8">Calculate fair pricing for influencer partnerships based on platform, audience size, engagement, and industry standards.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Influencer Rates</CardTitle>
              <CardDescription>Enter influencer metrics to get pricing recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="followers">Follower Count</Label>
                <Input
                  id="followers"
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label htmlFor="engagement">Engagement Rate (%)</Label>
                <Input
                  id="engagement"
                  type="number"
                  step="0.1"
                  value={engagement}
                  onChange={(e) => setEngagement(e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </div>
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {platform === "instagram" && (
                      <>
                        <SelectItem value="post">Feed Post</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="reel">Reel</SelectItem>
                      </>
                    )}
                    {platform === "tiktok" && (
                      <>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="live">Live Stream</SelectItem>
                      </>
                    )}
                    {platform === "youtube" && (
                      <>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="sponsor">Sponsored Segment</SelectItem>
                      </>
                    )}
                    {platform === "twitter" && (
                      <>
                        <SelectItem value="tweet">Tweet</SelectItem>
                        <SelectItem value="thread">Thread</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateRates} className="w-full">
                Calculate Rates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Recommendations</CardTitle>
              <CardDescription>Suggested rates based on industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              {rates ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${rates.min} - ${rates.max}
                    </div>
                    <p className="text-gray-600 mb-1">Price Range</p>
                    <p className="text-sm text-gray-500">
                      Suggested: ${rates.suggested}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold mb-1">
                        {rates.tier}
                      </div>
                      <div className="text-sm text-gray-600">Influencer Tier</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold mb-1">
                        ${rates.cpm}
                      </div>
                      <div className="text-sm text-gray-600">CPM</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Pricing Tips:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Higher engagement = higher rates</li>
                      <li>• Niche audiences command premium pricing</li>
                      <li>• Long-term partnerships often get discounts</li>
                      <li>• Usage rights may increase costs</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Enter influencer metrics to see pricing recommendations
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Fair Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Calculate fair rates based on industry standards
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Audience Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Factor in engagement rates and audience authenticity
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Platform Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Different rates for different platforms and content types
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Market Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Stay updated with current market pricing trends
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Influencer Pricing Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing Factors</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Follower Count:</strong> Base metric for pricing</li>
                <li><strong>Engagement Rate:</strong> Quality over quantity</li>
                <li><strong>Content Type:</strong> Video content costs more</li>
                <li><strong>Industry:</strong> Beauty/tech command premium</li>
                <li><strong>Usage Rights:</strong> Additional licensing fees</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Negotiation Tips</h3>
              <ul className="text-sm space-y-2">
                <li>• Always ask for media kit and analytics</li>
                <li>• Consider package deals for multiple posts</li>
                <li>• Factor in production costs and time</li>
                <li>• Set clear deliverables and timelines</li>
                <li>• Include performance metrics in contracts</li>
              </ul>
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
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:alex@creators200.com?subject=Creators%20200%20Advertising" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Advertise
                  </a>
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
                    href="https://x.com/Creators200" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:alex@creators200.com" 
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
                href="https://x.com/Creators200" 
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
}