import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Calendar, Smartphone } from "lucide-react";

export default function AudienceDemographics() {
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [demographics, setDemographics] = useState<any>(null);

  const sampleDemographics = {
    instagram: {
      beauty: {
        ageGroups: [
          { range: "13-17", percentage: 15 },
          { range: "18-24", percentage: 35 },
          { range: "25-34", percentage: 30 },
          { range: "35-44", percentage: 15 },
          { range: "45+", percentage: 5 }
        ],
        gender: { female: 75, male: 23, other: 2 },
        locations: [
          { country: "United States", percentage: 40 },
          { country: "United Kingdom", percentage: 15 },
          { country: "Canada", percentage: 12 },
          { country: "Australia", percentage: 10 },
          { country: "Other", percentage: 23 }
        ],
        interests: [
          { interest: "Beauty & Cosmetics", percentage: 85 },
          { interest: "Fashion", percentage: 70 },
          { interest: "Skincare", percentage: 65 },
          { interest: "Lifestyle", percentage: 55 },
          { interest: "Health & Wellness", percentage: 45 }
        ],
        devices: { mobile: 85, desktop: 10, tablet: 5 },
        engagement: { likes: 4.2, comments: 0.8, shares: 0.3 }
      },
      fitness: {
        ageGroups: [
          { range: "13-17", percentage: 8 },
          { range: "18-24", percentage: 25 },
          { range: "25-34", percentage: 40 },
          { range: "35-44", percentage: 20 },
          { range: "45+", percentage: 7 }
        ],
        gender: { female: 55, male: 43, other: 2 },
        locations: [
          { country: "United States", percentage: 45 },
          { country: "Brazil", percentage: 12 },
          { country: "Germany", percentage: 10 },
          { country: "United Kingdom", percentage: 8 },
          { country: "Other", percentage: 25 }
        ],
        interests: [
          { interest: "Fitness & Exercise", percentage: 90 },
          { interest: "Nutrition", percentage: 75 },
          { interest: "Sports", percentage: 60 },
          { interest: "Health & Wellness", percentage: 70 },
          { interest: "Outdoor Activities", percentage: 50 }
        ],
        devices: { mobile: 80, desktop: 15, tablet: 5 },
        engagement: { likes: 3.8, comments: 1.2, shares: 0.5 }
      }
    },
    tiktok: {
      beauty: {
        ageGroups: [
          { range: "13-17", percentage: 25 },
          { range: "18-24", percentage: 45 },
          { range: "25-34", percentage: 20 },
          { range: "35-44", percentage: 8 },
          { range: "45+", percentage: 2 }
        ],
        gender: { female: 80, male: 18, other: 2 },
        locations: [
          { country: "United States", percentage: 35 },
          { country: "United Kingdom", percentage: 12 },
          { country: "Philippines", percentage: 8 },
          { country: "India", percentage: 10 },
          { country: "Other", percentage: 35 }
        ],
        interests: [
          { interest: "Beauty & Makeup", percentage: 88 },
          { interest: "Fashion Trends", percentage: 75 },
          { interest: "DIY & Tutorials", percentage: 65 },
          { interest: "Pop Culture", percentage: 60 },
          { interest: "Dance & Music", percentage: 55 }
        ],
        devices: { mobile: 95, desktop: 3, tablet: 2 },
        engagement: { likes: 6.5, comments: 1.5, shares: 2.1 }
      }
    }
  };

  const generateDemographics = () => {
    if (!platform || !category) {
      alert("Please select platform and category");
      return;
    }

    const platformData = sampleDemographics[platform as keyof typeof sampleDemographics];
    const categoryData = platformData?.[category as keyof typeof platformData];
    
    if (categoryData) {
      setDemographics(categoryData);
    } else {
      // Generate generic demographics if specific combination not found
      setDemographics({
        ageGroups: [
          { range: "13-17", percentage: 12 },
          { range: "18-24", percentage: 32 },
          { range: "25-34", percentage: 28 },
          { range: "35-44", percentage: 18 },
          { range: "45+", percentage: 10 }
        ],
        gender: { female: 60, male: 38, other: 2 },
        locations: [
          { country: "United States", percentage: 42 },
          { country: "United Kingdom", percentage: 12 },
          { country: "Canada", percentage: 8 },
          { country: "Australia", percentage: 6 },
          { country: "Other", percentage: 32 }
        ],
        interests: [
          { interest: "General Interest", percentage: 85 },
          { interest: "Entertainment", percentage: 65 },
          { interest: "Lifestyle", percentage: 55 },
          { interest: "Technology", percentage: 45 },
          { interest: "Travel", percentage: 35 }
        ],
        devices: { mobile: 85, desktop: 10, tablet: 5 },
        engagement: { likes: 4.0, comments: 1.0, shares: 0.4 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-reckless font-medium text-gray-900 mb-4">Audience Demographics Analyzer</h1>
        <p className="text-gray-700 mb-8">Analyze audience demographics for influencer partnerships and understand who you're reaching across different platforms and niches.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Demographics</CardTitle>
              <CardDescription>Select platform and category to view audience data</CardDescription>
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
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="food">Food & Cooking</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Focus Location (Optional)</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., United States, Europe"
                />
              </div>
              <Button onClick={generateDemographics} className="w-full">
                Analyze Demographics
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Demographic Insights</CardTitle>
              <CardDescription>Audience breakdown and characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              {demographics ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Age Distribution
                    </h3>
                    <div className="space-y-2">
                      {demographics.ageGroups.map((group: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{group.range} years</span>
                          <div className="flex items-center space-x-2 flex-1 mx-4">
                            <Progress value={group.percentage} className="flex-1" />
                            <span className="text-sm font-medium w-10">{group.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Gender Split
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">{demographics.gender.female}%</div>
                        <div className="text-sm text-gray-600">Female</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{demographics.gender.male}%</div>
                        <div className="text-sm text-gray-600">Male</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{demographics.gender.other}%</div>
                        <div className="text-sm text-gray-600">Other</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Device Usage
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold">{demographics.devices.mobile}%</div>
                        <div className="text-xs text-gray-600">Mobile</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold">{demographics.devices.desktop}%</div>
                        <div className="text-xs text-gray-600">Desktop</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold">{demographics.devices.tablet}%</div>
                        <div className="text-xs text-gray-600">Tablet</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select platform and category to view demographic insights
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {demographics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.locations.map((location: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{location.country}</span>
                      <div className="flex items-center space-x-2 flex-1 mx-4">
                        <Progress value={location.percentage} className="flex-1" />
                        <span className="text-sm font-medium w-10">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.interests.map((interest: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{interest.interest}</span>
                      <div className="flex items-center space-x-2 flex-1 mx-4">
                        <Progress value={interest.percentage} className="flex-1" />
                        <span className="text-sm font-medium w-10">{interest.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Make Data-Driven Partnership Decisions</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Understanding audience demographics is crucial for successful influencer partnerships. Match your target 
              audience with the right influencers to maximize campaign effectiveness and ROI.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Audience Matching</h3>
                <p className="text-sm text-gray-600">Find influencers with audiences that match your target demographic</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Geographic Targeting</h3>
                <p className="text-sm text-gray-600">Target specific regions for location-based campaigns</p>
              </div>
              <div className="text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-2">Platform Optimization</h3>
                <p className="text-sm text-gray-600">Optimize content for the devices your audience uses most</p>
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
                    href="https://x.com/trycreators" 
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
                href="https://x.com/trycreators" 
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