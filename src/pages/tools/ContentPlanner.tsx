import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Target } from "lucide-react";

export default function ContentPlanner() {
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const contentIdeas = {
    instagram: {
      educational: [
        { type: "Carousel Post", idea: "Step-by-step tutorial", time: "Best time: 11 AM - 1 PM", engagement: "High" },
        { type: "Story Highlights", idea: "FAQ compilation", time: "Best time: 9 AM - 11 AM", engagement: "Medium" },
        { type: "Reel", idea: "Quick tips or hacks", time: "Best time: 7 PM - 9 PM", engagement: "Very High" }
      ],
      entertainment: [
        { type: "Reel", idea: "Behind-the-scenes content", time: "Best time: 6 PM - 8 PM", engagement: "Very High" },
        { type: "Story", idea: "Day-in-the-life content", time: "Best time: 2 PM - 4 PM", engagement: "High" },
        { type: "Post", idea: "Funny memes or quotes", time: "Best time: 12 PM - 2 PM", engagement: "Medium" }
      ],
      promotional: [
        { type: "Post", idea: "Product showcase", time: "Best time: 10 AM - 12 PM", engagement: "Medium" },
        { type: "Story", idea: "Limited-time offers", time: "Best time: 1 PM - 3 PM", engagement: "High" },
        { type: "Reel", idea: "Product demonstration", time: "Best time: 5 PM - 7 PM", engagement: "Very High" }
      ]
    },
    tiktok: {
      educational: [
        { type: "Tutorial Video", idea: "How-to content", time: "Best time: 6 PM - 10 PM", engagement: "Very High" },
        { type: "Explainer Video", idea: "Industry insights", time: "Best time: 12 PM - 3 PM", engagement: "High" },
        { type: "Myth-busting", idea: "Common misconceptions", time: "Best time: 7 PM - 9 PM", engagement: "High" }
      ],
      entertainment: [
        { type: "Trend Video", idea: "Popular challenge or dance", time: "Best time: 6 PM - 9 PM", engagement: "Very High" },
        { type: "Comedy Skit", idea: "Relatable scenarios", time: "Best time: 7 PM - 10 PM", engagement: "Very High" },
        { type: "Duet/Stitch", idea: "React to trending content", time: "Best time: 8 PM - 11 PM", engagement: "High" }
      ],
      promotional: [
        { type: "Product Demo", idea: "Show product in action", time: "Best time: 11 AM - 2 PM", engagement: "High" },
        { type: "Testimonial", idea: "Customer reviews", time: "Best time: 1 PM - 4 PM", engagement: "Medium" },
        { type: "Before/After", idea: "Transformation content", time: "Best time: 3 PM - 6 PM", engagement: "High" }
      ]
    }
  };

  const generatePlan = () => {
    if (!contentType || !platform || !audience || !goal) {
      alert("Please fill in all fields");
      return;
    }

    const platformData = contentIdeas[platform as keyof typeof contentIdeas];
    const typeData = platformData[contentType as keyof typeof platformData] || [];
    
    setSuggestions(typeData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Planner</h1>
        <p className="text-gray-700 mb-8">Plan your social media content strategy with personalized recommendations and optimal posting times.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Plan Your Content</CardTitle>
              <CardDescription>Tell us about your content goals</CardDescription>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., young professionals, fitness enthusiasts"
                />
              </div>
              <div>
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Increase Engagement</SelectItem>
                    <SelectItem value="sales">Drive Sales</SelectItem>
                    <SelectItem value="education">Educate Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generatePlan} className="w-full">
                Generate Content Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Suggestions</CardTitle>
              <CardDescription>Personalized recommendations for your strategy</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{suggestion.type}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          suggestion.engagement === 'Very High' ? 'bg-green-100 text-green-800' :
                          suggestion.engagement === 'High' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {suggestion.engagement} Engagement
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{suggestion.idea}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {suggestion.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Fill in your preferences and click generate to see content suggestions
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Plan your posts in advance and maintain consistent posting schedule
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Understand your audience behavior and preferences for better content
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Goal Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Monitor your content performance and adjust strategy accordingly
              </p>
            </CardContent>
          </Card>
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
}