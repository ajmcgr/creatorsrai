import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Database, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  Smartphone,
  Globe,
  Repeat
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Clock,
      title: "Weekly Updates",
      description: "Automated data refresh every Monday at 03:00 UTC using Lovable Cloud backend functions."
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Week-over-week delta tracking shows real growth trends and percentage changes."
    },
    {
      icon: Database,
      title: "Cached Data",
      description: "Smart caching system ensures fast loading while keeping costs manageable."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "No user tracking, no personal data collection. Just public social media statistics."
    }
  ];

  const platforms = [
    { name: "YouTube", metric: "Subscribers", color: "bg-red-500" },
    { name: "Instagram", metric: "Followers", color: "bg-pink-500" },
    { name: "TikTok", metric: "Followers", color: "bg-black" },
    { name: "Twitch", metric: "Followers", color: "bg-purple-500" },
    { name: "Facebook", metric: "Followers", color: "bg-blue-600" }
  ];

  const methodology = [
    {
      step: "1",
      title: "Data Collection",
      description: "Automated backend function queries Social Blade Business API for top performers."
    },
    {
      step: "2", 
      title: "Delta Calculation",
      description: "Compare current week data with previous week to calculate growth metrics."
    },
    {
      step: "3",
      title: "Caching & Storage", 
      description: "Store processed data in Lovable Cloud database for fast, reliable access."
    },
    {
      step: "4",
      title: "Live Updates",
      description: "Frontend displays real-time rankings with beautiful animations and insights."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-5xl font-bold mb-6 animate-fade-in">
              About RankedPeople
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up leading-relaxed">
              A clean, Apple-inspired leaderboard that tracks the most talked-about people 
              online using real-time social media analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Badge variant="secondary" className="text-sm">
                <Globe className="w-4 h-4 mr-1" />
                5 Platforms
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Repeat className="w-4 h-4 mr-1" />
                Weekly Updates
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Growth Analytics
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-20">
        {/* Features */}
        <section>
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Supported Platforms */}
        <section>
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Supported Platforms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {platforms.map((platform, index) => (
              <Card 
                key={platform.name}
                className="p-6 text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${platform.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">{platform.metric}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((step, index) => (
              <Card 
                key={step.step}
                className="p-8 text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-gradient-surface rounded-2xl p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-8">
              Technical Implementation
            </h2>
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Cost Efficiency
                </h3>
                <p className="text-muted-foreground pl-7">
                  Weekly refresh strategy keeps Social Blade API costs around $40-100/month 
                  (~400 credits) while providing fresh data.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-primary" />
                  Data Architecture
                </h3>
                <p className="text-muted-foreground pl-7">
                  Lovable Cloud backend with automated Edge Functions, SQL views for 
                  delta calculations, and optimized caching layers.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Growth Analytics
                </h3>
                <p className="text-muted-foreground pl-7">
                  Week-over-week comparisons with percentage growth calculations, 
                  trend indicators, and historical data preservation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="text-center">
          <Card className="p-12 bg-gradient-surface border-0">
            <h2 className="font-display text-2xl font-bold mb-4">
              Data Attribution
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              All social media statistics are provided by the Social Blade Business API. 
              RankedPeople is an independent project and is not affiliated with Social Blade.
            </p>
            <Badge variant="secondary" className="text-sm">
              Powered by Social Blade Business API
            </Badge>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-secondary/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 RankedPeople. Data provided by Social Blade API.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;