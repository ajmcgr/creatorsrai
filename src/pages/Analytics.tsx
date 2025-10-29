import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/AuthHeader";
import SocialBladeStats from "@/components/SocialBladeStats";
import { Eye, Users, TrendingUp, MousePointerClick } from "lucide-react";

const Analytics = () => {
  const stats = [
    { label: "Total Views", value: "1,234", icon: Eye, change: "+12%" },
    { label: "Unique Visitors", value: "856", icon: Users, change: "+8%" },
    { label: "Engagement Rate", value: "24%", icon: TrendingUp, change: "+3%" },
    { label: "Click-through Rate", value: "18%", icon: MousePointerClick, change: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics</h1>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-primary">{stat.change}</p>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <SocialBladeStats />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Media Kit Performance</CardTitle>
              <CardDescription>View detailed analytics for your media kits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Create your first media kit to see analytics</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
