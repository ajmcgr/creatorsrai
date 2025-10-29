import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InfluencerRateCalculator = () => {
  const [platform, setPlatform] = useState("instagram");
  const [followers, setFollowers] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  const calculateRate = () => {
    const followerCount = parseInt(followers);
    if (isNaN(followerCount) || followerCount <= 0) {
      return;
    }

    let calculatedRate = 0;
    switch (platform) {
      case "instagram":
        calculatedRate = followerCount * 0.01;
        break;
      case "tiktok":
        calculatedRate = followerCount * 0.015;
        break;
      case "youtube":
        calculatedRate = followerCount * 0.02;
        break;
    }

    setRate(calculatedRate);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Influencer Rate Calculator
            </h1>
            <p className="text-xl text-muted-foreground">
              Calculate your suggested rate per post based on your follower count and platform
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Calculate Your Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="followers">Total Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  placeholder="Enter your follower count"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                />
              </div>

              <Button onClick={calculateRate} className="w-full" variant="hero">
                Calculate Rate
              </Button>

              {rate !== null && (
                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Suggested Rate Per Post</p>
                  <p className="text-4xl font-bold text-primary">
                    ${rate.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : "YouTube"} industry averages
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Want to track all your metrics in one place?
            </p>
            <Button variant="outline" asChild>
              <a href="/auth?mode=signup">Create Your Media Kit</a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InfluencerRateCalculator;
