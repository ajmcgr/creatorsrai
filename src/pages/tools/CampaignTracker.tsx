import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share, DollarSign, Calendar } from "lucide-react";

export default function CampaignTracker() {
  const [campaignName, setCampaignName] = useState("");
  const [platform, setPlatform] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [tracking, setTracking] = useState<any>(null);

  const sampleCampaigns = [
    {
      id: 1,
      name: "Summer Beauty Collection",
      platform: "Instagram",
      status: "Active",
      budget: 15000,
      spent: 8500,
      influencers: 8,
      posts: 24,
      reach: 2400000,
      impressions: 4800000,
      engagement: 156000,
      clicks: 24500,
      conversions: 890,
      revenue: 45000,
      roi: 265,
      startDate: "2024-06-01",
      endDate: "2024-07-31"
    },
    {
      id: 2,
      name: "Tech Product Launch",
      platform: "YouTube",
      status: "Completed",
      budget: 25000,
      spent: 23800,
      influencers: 5,
      posts: 15,
      reach: 1800000,
      impressions: 3200000,
      engagement: 89000,
      clicks: 18200,
      conversions: 1200,
      revenue: 72000,
      roi: 302,
      startDate: "2024-05-15",
      endDate: "2024-06-15"
    },
    {
      id: 3,
      name: "Fitness Challenge",
      platform: "TikTok",
      status: "Active",
      budget: 12000,
      spent: 7200,
      influencers: 12,
      posts: 36,
      reach: 3200000,
      impressions: 8500000,
      engagement: 425000,
      clicks: 32000,
      conversions: 650,
      revenue: 28000,
      roi: 158,
      startDate: "2024-06-15",
      endDate: "2024-08-15"
    }
  ];

  const createCampaign = () => {
    if (!campaignName || !platform || !budget || !startDate) {
      alert("Please fill in all fields");
      return;
    }

    // Create a new campaign with initial tracking data
    const newCampaign = {
      id: Date.now(),
      name: campaignName,
      platform,
      status: "Planning",
      budget: parseInt(budget),
      spent: 0,
      influencers: 0,
      posts: 0,
      reach: 0,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
      startDate,
      endDate: ""
    };

    setTracking(newCampaign);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-reckless font-medium text-gray-900 mb-4">Campaign Tracker</h1>
        <p className="text-gray-700 mb-8">Track and monitor your influencer campaign performance across multiple platforms with real-time analytics and ROI insights.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Set up tracking for a new influencer campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Product Launch"
                />
              </div>
              <div>
                <Label htmlFor="platform">Primary Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Campaign Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <Button onClick={createCampaign} className="w-full">
                Create Campaign
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>Key metrics across all active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Active Campaigns</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$52K</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">25</div>
                  <div className="text-sm text-gray-600">Influencers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">242%</div>
                  <div className="text-sm text-gray-600">Avg ROI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Campaign Performance</h2>
          <div className="space-y-6">
            {sampleCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{campaign.platform}</span>
                        <span>•</span>
                        <span>{campaign.influencers} influencers</span>
                        <span>•</span>
                        <span>{campaign.posts} posts</span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="w-4 h-4 mr-1 text-blue-600" />
                      </div>
                      <div className="font-semibold">{formatNumber(campaign.reach)}</div>
                      <div className="text-xs text-gray-600">Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 mr-1 text-purple-600" />
                      </div>
                      <div className="font-semibold">{formatNumber(campaign.impressions)}</div>
                      <div className="text-xs text-gray-600">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="w-4 h-4 mr-1 text-red-600" />
                      </div>
                      <div className="font-semibold">{formatNumber(campaign.engagement)}</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle className="w-4 h-4 mr-1 text-green-600" />
                      </div>
                      <div className="font-semibold">{formatNumber(campaign.clicks)}</div>
                      <div className="text-xs text-gray-600">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Share className="w-4 h-4 mr-1 text-orange-600" />
                      </div>
                      <div className="font-semibold">{campaign.conversions}</div>
                      <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
                      </div>
                      <div className="font-semibold text-green-600">{campaign.roi}%</div>
                      <div className="text-xs text-gray-600">ROI</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Budget: ${campaign.budget.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Spent: ${campaign.spent.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Revenue: ${campaign.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{campaign.startDate}</span>
                      {campaign.endDate && <span> - {campaign.endDate}</span>}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Budget Used</span>
                      <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {tracking && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Campaign Created</CardTitle>
              <CardDescription>Your campaign "{tracking.name}" has been set up for tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl font-bold">{tracking.platform}</div>
                  <div className="text-sm text-gray-600">Platform</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl font-bold">${tracking.budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Budget</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl font-bold">{tracking.startDate}</div>
                  <div className="text-sm text-gray-600">Start Date</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Badge className={getStatusColor(tracking.status)}>
                    {tracking.status}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Optimize Your Campaign Performance</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Track every aspect of your influencer campaigns from reach and engagement to conversions and ROI. 
              Make data-driven decisions to maximize your marketing investment and achieve better results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">Monitor campaign performance as it happens</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">ROI Tracking</h3>
                <p className="text-sm text-gray-600">Calculate exact return on marketing investment</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Multi-Platform</h3>
                <p className="text-sm text-gray-600">Track campaigns across all major social platforms</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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