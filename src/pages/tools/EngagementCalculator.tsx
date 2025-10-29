import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EngagementCalculator = () => {
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState<number | null>(null);

  const calculateEngagement = () => {
    const likesNum = parseInt(likes) || 0;
    const commentsNum = parseInt(comments) || 0;
    const sharesNum = parseInt(shares) || 0;
    const followersNum = parseInt(followers);

    if (isNaN(followersNum) || followersNum <= 0) {
      return;
    }

    const totalEngagement = likesNum + commentsNum + sharesNum;
    const rate = (totalEngagement / followersNum) * 100;
    setEngagementRate(rate);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Engagement Rate Calculator
            </h1>
            <p className="text-xl text-muted-foreground">
              Calculate your engagement rate based on likes, comments, shares, and followers
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Calculate Your Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="likes">Total Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  placeholder="Enter total likes"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Total Comments</Label>
                <Input
                  id="comments"
                  type="number"
                  placeholder="Enter total comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shares">Total Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="Enter total shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
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

              <Button onClick={calculateEngagement} className="w-full">
                Calculate Engagement Rate
              </Button>

              {engagementRate !== null && (
                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Engagement Rate</p>
                  <p className="text-4xl font-bold text-primary">
                    {engagementRate.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {engagementRate > 3 
                      ? "Excellent! Your audience is highly engaged." 
                      : engagementRate > 1 
                      ? "Good engagement rate. Keep it up!" 
                      : "Consider creating more engaging content."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EngagementCalculator;
