import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const AudienceDemographics = () => {
  const [demographics, setDemographics] = useState({
    age1824: "",
    age2534: "",
    age3544: "",
    age45plus: "",
    male: "",
    female: "",
    other: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Users className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-center mb-4">Audience Demographics Tool</h1>
          <p className="text-center text-muted-foreground mb-12">
            Visualize and analyze your audience demographics
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Enter Your Audience Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Age Distribution (%)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age1824">18-24</Label>
                    <Input
                      id="age1824"
                      type="number"
                      value={demographics.age1824}
                      onChange={(e) => setDemographics({ ...demographics, age1824: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age2534">25-34</Label>
                    <Input
                      id="age2534"
                      type="number"
                      value={demographics.age2534}
                      onChange={(e) => setDemographics({ ...demographics, age2534: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age3544">35-44</Label>
                    <Input
                      id="age3544"
                      type="number"
                      value={demographics.age3544}
                      onChange={(e) => setDemographics({ ...demographics, age3544: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age45plus">45+</Label>
                    <Input
                      id="age45plus"
                      type="number"
                      value={demographics.age45plus}
                      onChange={(e) => setDemographics({ ...demographics, age45plus: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Gender Distribution (%)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="male">Male</Label>
                    <Input
                      id="male"
                      type="number"
                      value={demographics.male}
                      onChange={(e) => setDemographics({ ...demographics, male: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="female">Female</Label>
                    <Input
                      id="female"
                      type="number"
                      value={demographics.female}
                      onChange={(e) => setDemographics({ ...demographics, female: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="other">Other</Label>
                    <Input
                      id="other"
                      type="number"
                      value={demographics.other}
                      onChange={(e) => setDemographics({ ...demographics, other: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">Generate Visualization</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AudienceDemographics;
