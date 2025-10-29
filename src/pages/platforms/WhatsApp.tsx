import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, TrendingUp, Users, BarChart } from "lucide-react";

const WhatsApp = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "WhatsApp Channel Stats",
      description: "Showcase your WhatsApp channel subscriber count and reach",
    },
    {
      icon: TrendingUp,
      title: "WhatsApp-Optimized Templates",
      description: "Templates designed specifically for WhatsApp channel owners",
    },
    {
      icon: Users,
      title: "Channel Performance",
      description: "Track your channel growth and message engagement",
    },
    {
      icon: BarChart,
      title: "Engagement Metrics",
      description: "Calculate your WhatsApp channel engagement for brand partnerships",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">WhatsApp Media Kit Creator</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create professional media kits that showcase your WhatsApp channel and land brand deals
          </p>
          <Button size="lg">Create Your WhatsApp Media Kit</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WhatsApp;
