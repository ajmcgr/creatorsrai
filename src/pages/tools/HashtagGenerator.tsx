import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const hashtagData = {
    instagram: {
      fitness: ["#fitness", "#workout", "#gym", "#health", "#fitnessmotivation", "#bodybuilding", "#training", "#exercise", "#muscle", "#strength"],
      food: ["#food", "#foodie", "#delicious", "#yummy", "#cooking", "#recipe", "#chef", "#foodstagram", "#tasty", "#homemade"],
      travel: ["#travel", "#wanderlust", "#vacation", "#explore", "#adventure", "#trip", "#holiday", "#traveling", "#instatravel", "#tourism"],
      fashion: ["#fashion", "#style", "#outfit", "#ootd", "#fashionista", "#streetstyle", "#trends", "#clothing", "#designer", "#look"],
      tech: ["#tech", "#technology", "#innovation", "#digital", "#startup", "#ai", "#coding", "#software", "#gadgets", "#future"]
    },
    tiktok: {
      fitness: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#fittok", "#gymtok", "#workoutmotivation", "#health", "#exercise", "#training"],
      food: ["#food", "#cooking", "#recipe", "#foodtok", "#chef", "#baking", "#kitchen", "#yummy", "#delicious", "#homecooking"],
      travel: ["#travel", "#vacation", "#trip", "#explore", "#adventure", "#wanderlust", "#holiday", "#tourism", "#traveltok", "#backpacking"],
      fashion: ["#fashion", "#style", "#outfit", "#ootd", "#fashiontok", "#styleinspo", "#trendy", "#clothing", "#shopping", "#lookbook"],
      tech: ["#tech", "#technology", "#techtok", "#innovation", "#gadgets", "#ai", "#coding", "#software", "#startup", "#digital"]
    }
  };

  const generateHashtags = () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword");
      return;
    }

    const platformData = hashtagData[platform as keyof typeof hashtagData];
    const lowerKeyword = keyword.toLowerCase();
    
    // Find matching category or generate generic hashtags
    let generatedTags: string[] = [];
    
    for (const [category, tags] of Object.entries(platformData)) {
      if (lowerKeyword.includes(category) || category.includes(lowerKeyword)) {
        generatedTags = [...tags];
        break;
      }
    }
    
    // If no specific match, generate general hashtags
    if (generatedTags.length === 0) {
      generatedTags = [
        `#${keyword.replace(/\s+/g, '').toLowerCase()}`,
        `#${keyword.replace(/\s+/g, '').toLowerCase()}life`,
        `#${keyword.replace(/\s+/g, '').toLowerCase()}love`,
        `#${keyword.replace(/\s+/g, '').toLowerCase()}community`,
        `#${keyword.replace(/\s+/g, '').toLowerCase()}inspiration`,
        "#viral", "#trending", "#explore", "#fyp", "#instagood"
      ];
    }
    
    setHashtags(generatedTags);
  };

  const copyToClipboard = () => {
    const hashtagText = hashtags.join(" ");
    navigator.clipboard.writeText(hashtagText);
    alert("Hashtags copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-reckless font-medium text-gray-900 mb-4">Hashtag Generator</h1>
        <p className="text-gray-700 mb-8">Generate relevant hashtags for your social media posts to increase reach and engagement.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Generate Hashtags</CardTitle>
              <CardDescription>Enter a keyword and select your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyword">Keyword or Topic</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., fitness, food, travel"
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateHashtags} className="w-full">
                Generate Hashtags
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Hashtags</CardTitle>
              <CardDescription>Copy and paste these hashtags to your posts</CardDescription>
            </CardHeader>
            <CardContent>
              {hashtags.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={copyToClipboard} variant="outline" className="w-full">
                    Copy All Hashtags
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Enter a keyword and click generate to see hashtags
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hashtag Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Instagram Tips:</h3>
              <ul className="text-sm space-y-1">
                <li>• Use 5-10 hashtags for optimal reach</li>
                <li>• Mix popular and niche hashtags</li>
                <li>• Research hashtags before using them</li>
                <li>• Create branded hashtags for campaigns</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">TikTok Tips:</h3>
              <ul className="text-sm space-y-1">
                <li>• Use 3-5 relevant hashtags</li>
                <li>• Include trending hashtags when relevant</li>
                <li>• Use niche hashtags for targeted reach</li>
                <li>• Add #fyp or #foryou to reach more users</li>
              </ul>
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