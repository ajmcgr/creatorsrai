import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Target, BarChart3 } from "lucide-react";

export default function ROICalculator() {
  const [campaignType, setCampaignType] = useState("");
  const [investment, setInvestment] = useState("");
  const [revenue, setRevenue] = useState("");
  const [impressions, setImpressions] = useState("");
  const [clicks, setClicks] = useState("");
  const [conversions, setConversions] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    const investmentNum = parseFloat(investment) || 0;
    const revenueNum = parseFloat(revenue) || 0;
    const impressionsNum = parseInt(impressions) || 0;
    const clicksNum = parseInt(clicks) || 0;
    const conversionsNum = parseInt(conversions) || 0;

    if (investmentNum === 0) {
      alert("Please enter your campaign investment");
      return;
    }

    const roi = ((revenueNum - investmentNum) / investmentNum) * 100;
    const ctr = impressionsNum > 0 ? (clicksNum / impressionsNum) * 100 : 0;
    const conversionRate = clicksNum > 0 ? (conversionsNum / clicksNum) * 100 : 0;
    const cpc = clicksNum > 0 ? investmentNum / clicksNum : 0;
    const cpa = conversionsNum > 0 ? investmentNum / conversionsNum : 0;

    setResults({
      roi,
      profit: revenueNum - investmentNum,
      ctr,
      conversionRate,
      cpc,
      cpa
    });
  };

  const getROIColor = (roi: number) => {
    if (roi > 100) return "text-green-600";
    if (roi > 0) return "text-blue-600";
    return "text-red-600";
  };

  const getROILabel = (roi: number) => {
    if (roi > 200) return "Excellent";
    if (roi > 100) return "Very Good";
    if (roi > 50) return "Good";
    if (roi > 0) return "Positive";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-reckless font-medium text-gray-900 mb-4">ROI Calculator</h1>
        <p className="text-gray-700 mb-8">Calculate the return on investment for your marketing campaigns and track key performance metrics.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Enter your campaign investment and performance data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaignType">Campaign Type</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="influencer">Influencer Marketing</SelectItem>
                    <SelectItem value="social-ads">Social Media Ads</SelectItem>
                    <SelectItem value="content">Content Marketing</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="investment">Total Investment ($)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              <div>
                <Label htmlFor="revenue">Revenue Generated ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g., 15000"
                />
              </div>
              <div>
                <Label htmlFor="impressions">Impressions (optional)</Label>
                <Input
                  id="impressions"
                  type="number"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  placeholder="e.g., 100000"
                />
              </div>
              <div>
                <Label htmlFor="clicks">Clicks (optional)</Label>
                <Input
                  id="clicks"
                  type="number"
                  value={clicks}
                  onChange={(e) => setClicks(e.target.value)}
                  placeholder="e.g., 2500"
                />
              </div>
              <div>
                <Label htmlFor="conversions">Conversions (optional)</Label>
                <Input
                  id="conversions"
                  type="number"
                  value={conversions}
                  onChange={(e) => setConversions(e.target.value)}
                  placeholder="e.g., 150"
                />
              </div>
              <Button onClick={calculateROI} className="w-full">
                Calculate ROI
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Your campaign performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className={`text-4xl font-bold ${getROIColor(results.roi)} mb-2`}>
                      {results.roi.toFixed(1)}%
                    </div>
                    <p className="text-gray-600 mb-1">Return on Investment</p>
                    <p className={`font-medium ${getROIColor(results.roi)}`}>
                      {getROILabel(results.roi)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold mb-1">
                        ${results.profit.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Profit</div>
                    </div>
                    
                    {results.ctr > 0 && (
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          {results.ctr.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-600">CTR</div>
                      </div>
                    )}
                    
                    {results.conversionRate > 0 && (
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          {results.conversionRate.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                    )}
                    
                    {results.cpc > 0 && (
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          ${results.cpc.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Cost per Click</div>
                      </div>
                    )}
                    
                    {results.cpa > 0 && (
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          ${results.cpa.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Cost per Acquisition</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Enter your campaign data and click calculate to see your ROI
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Revenue Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Track direct revenue attribution from your campaigns
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Monitor CTR, conversion rates, and other key metrics
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Set realistic ROI targets for future campaigns
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Generate detailed reports for stakeholders
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">ROI Benchmarks by Channel</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Email Marketing:</strong> 3600% average ROI</li>
                <li><strong>SEO:</strong> 748% average ROI</li>
                <li><strong>Content Marketing:</strong> 300% average ROI</li>
                <li><strong>Social Media Ads:</strong> 200% average ROI</li>
                <li><strong>Influencer Marketing:</strong> 650% average ROI</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Improving Your ROI</h3>
              <ul className="text-sm space-y-2">
                <li>• Target the right audience with precise demographics</li>
                <li>• Optimize your conversion funnel regularly</li>
                <li>• A/B test your creative and messaging</li>
                <li>• Track attribution across all touchpoints</li>
                <li>• Focus on high-intent keywords and platforms</li>
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