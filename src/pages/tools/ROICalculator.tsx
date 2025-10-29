import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROICalculator = () => {
  const [cost, setCost] = useState("");
  const [revenue, setRevenue] = useState("");
  const [roi, setRoi] = useState<number | null>(null);

  const calculateROI = () => {
    const costNum = parseFloat(cost);
    const revenueNum = parseFloat(revenue);

    if (isNaN(costNum) || isNaN(revenueNum) || costNum <= 0) {
      return;
    }

    const roiValue = ((revenueNum - costNum) / costNum) * 100;
    setRoi(roiValue);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              ROI Calculator
            </h1>
            <p className="text-xl text-muted-foreground">
              Calculate your return on investment for campaigns and collaborations
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Calculate Your ROI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cost">Campaign Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="Enter campaign cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue Generated ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="Enter revenue generated"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>

              <Button onClick={calculateROI} className="w-full" variant="hero">
                Calculate ROI
              </Button>

              {roi !== null && (
                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your ROI</p>
                  <p className={`text-4xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {roi > 100 
                      ? "Outstanding return! Your campaign was highly profitable." 
                      : roi > 0 
                      ? "Positive ROI! Your campaign generated profit." 
                      : "Negative ROI. Consider adjusting your strategy."}
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

export default ROICalculator;
