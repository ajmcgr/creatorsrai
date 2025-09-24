import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EngagementCalculator() {
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [engagementRate, setEngagementRate] = useState<number | null>(null);

  const calculateEngagement = () => {
    const followersNum = parseInt(followers) || 0;
    const likesNum = parseInt(likes) || 0;
    const commentsNum = parseInt(comments) || 0;
    const sharesNum = parseInt(shares) || 0;

    if (followersNum === 0) {
      alert("Please enter the number of followers");
      return;
    }

    const totalEngagement = likesNum + commentsNum + sharesNum;
    const rate = (totalEngagement / followersNum) * 100;
    setEngagementRate(rate);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Engagement Rate Calculator</h1>
        <p className="text-gray-700 mb-8">Calculate your social media engagement rate to measure how well your content resonates with your audience.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Engagement Rate</CardTitle>
              <CardDescription>Enter your social media metrics below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="followers">Total Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="likes">Likes (on recent post)</Label>
                <Input
                  id="likes"
                  type="number"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="comments">Comments (on recent post)</Label>
                <Input
                  id="comments"
                  type="number"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label htmlFor="shares">Shares (on recent post)</Label>
                <Input
                  id="shares"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="e.g., 25"
                />
              </div>
              <Button onClick={calculateEngagement} className="w-full">
                Calculate Engagement Rate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Results</CardTitle>
              <CardDescription>Engagement rate analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {engagementRate !== null ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {engagementRate.toFixed(2)}%
                    </div>
                    <p className="text-gray-600">Engagement Rate</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Benchmark Guide:</h3>
                    <ul className="text-sm space-y-1">
                      <li><span className="font-medium">Instagram:</span> 1-3% is average, 3-6% is good</li>
                      <li><span className="font-medium">TikTok:</span> 5-9% is average, 9%+ is excellent</li>
                      <li><span className="font-medium">YouTube:</span> 2-3% is average, 4%+ is excellent</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Enter your metrics and click calculate to see your engagement rate
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Engagement Rate</h2>
          <p className="text-gray-700 mb-4">
            Engagement rate is a crucial metric that measures how actively your audience interacts with your content. 
            It's calculated by dividing total engagement (likes + comments + shares) by your total follower count, 
            then multiplying by 100 to get a percentage.
          </p>
          <p className="text-gray-700">
            A higher engagement rate typically indicates that your content resonates well with your audience and 
            that your followers are genuinely interested in what you share. This metric is often more valuable 
            to brands than follower count alone.
          </p>
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
                    href="http://x.com/creatorslb" 
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
                href="http://x.com/creatorslb" 
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