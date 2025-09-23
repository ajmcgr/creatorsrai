import { TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Hero() {
  const stats = [
    { 
      icon: Users, 
      label: "People Tracked", 
      value: "500+",
      description: "Across all platforms"
    },
    { 
      icon: BarChart3, 
      label: "Platforms", 
      value: "5",
      description: "Major social networks"
    },
    { 
      icon: Calendar, 
      label: "Updated", 
      value: "Weekly",
      description: "Every Monday UTC"
    },
    { 
      icon: TrendingUp, 
      label: "Growth Tracking", 
      value: "WoW",
      description: "Week over week analytics"
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              World's Most Popular Creators
            </span>
            <span className="block text-4xl md:text-5xl mt-2">
              Real-time Leaderboard
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-slide-up font-light leading-relaxed">
            Discover the most talked-about people online. 
            <br className="hidden md:block" />
            Weekly updated rankings with real growth analytics.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.label}
                  className="p-6 bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/15 transition-all duration-300"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-white/90" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-white/90 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-white/70">
                    {stat.description}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <p className="text-white/80 text-sm">
              Updated every Monday at 03:00 UTC • Data from Social Blade API
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}