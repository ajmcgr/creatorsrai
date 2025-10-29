import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroDashboard from "@/assets/hero-dashboard.png";
import mediakitPreview from "@/assets/mediakit-preview.png";

const Index = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.senja.io/widget/2b0d90f5-363c-454e-bdf7-d065138f5b73/platform.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Your AI-Powered Media Kit Page Creator
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Land Brand Deals In Minutes,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Not Months
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create a professional media kit page and get discovered by brands all from one simple platform.
          </p>
          
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto">
              Create Your Media Kit Page
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            Monthly subscription • Cancel anytime • Secure checkout with Stripe
          </p>
          
          <div className="mt-12 max-w-5xl mx-auto">
            <img 
              src={heroDashboard} 
              alt="Creators dashboard showing media kit analytics" 
              className="rounded-lg shadow-2xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your Media Kit Page in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              Go from signup to shareable media kit page in under 5 minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Sign Up & Choose Template</h3>
                <p className="text-muted-foreground">
                  Create your account and pick from our professionally designed templates
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Add Your Content</h3>
                <p className="text-muted-foreground">
                  Fill in your bio, social stats, past work, and rates—takes just minutes
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Share Your Kit</h3>
                <p className="text-muted-foreground">
                  Get your custom link to share with brands and collaborators
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Only Media Kit Page You'll Ever Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Showcase your best work, stats, and rates in one stunning, auto-updating page
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">A Media Kit Page That Converts</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Professionally designed templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Mobile-responsive and fast-loading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom branded URL</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Track Your Performance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Real-time analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>View tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Stats refreshes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <Sparkles className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Monetize Your Influence</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>ROI & rate calculators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Link directly to payment platforms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free or upgrade for advanced features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>1 media kit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Professional template designs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom branded URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Mobile-responsive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>ROI & rate calculators</span>
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="relative border-2 border-primary shadow-lg scale-105">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                Most Popular
              </Badge>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Up to 5 media kits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Professional template designs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom branded URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Real-time analytics & view tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>PDF export & Canva integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Remove Creators branding</span>
                  </li>
                </ul>
                <a href="https://buy.stripe.com/test_4gw3eI2Wm0xw8TK3cc" target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" className="w-full">Upgrade to Pro</Button>
                </a>
              </CardContent>
            </Card>
            
            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Business Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Up to 20 media kits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <a href="https://buy.stripe.com/test_5kA9D6aSYdkg0nr5kl" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Upgrade to Business</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">What is a media kit page?</h3>
                <p className="text-muted-foreground">
                  A media kit page is a professional webpage that showcases your social media stats, audience demographics, past collaborations, and rates. It helps brands quickly understand your value as a creator.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">How do I get paid?</h3>
                <p className="text-muted-foreground">
                  We use Stripe for secure payment processing. You can cancel anytime.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Can I export my media kit?</h3>
                <p className="text-muted-foreground">
                  Yes! Pro and Business users can export their media kits as PDF or integrate with Canva.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee if you're not satisfied.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Loved by Creators
          </h2>
          <div className="senja-embed" data-id="2b0d90f5-363c-454e-bdf7-d065138f5b73" data-mode="shadow" data-lazyload="false"></div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Land More Brand Deals?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've already created their professional media kit pages
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6 h-auto">
              Create Your Media Kit Page Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
