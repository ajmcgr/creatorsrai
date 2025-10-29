import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
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
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Your AI-Powered Media Kit Page Creator
          </Badge>
          
          <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
            Land Brand Deals In<br /><span className="text-primary">Minutes, Not Months</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create a professional media kit page and get discovered by brands all from one simple platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="h-11 px-8">
                Create Your Media Kit Page
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="senja-embed" data-id="2b0d90f5-363c-454e-bdf7-d065138f5b73" data-mode="shadow" data-lazyload="false"></div>
          </div>
          
          <p className="text-sm text-muted-foreground">
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
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free or upgrade for advanced features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <h3 className="text-2xl mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">1 media kit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Social media integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">PDF export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Link to="/auth?mode=signup">
                  <Button variant="ghost" className="w-full h-11">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary shadow-lg hover:scale-105 transition-all relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <CardContent className="p-6">
                <h3 className="text-2xl mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unlimited media kits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Collaboration tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>
                <a href="https://buy.stripe.com/test_4gw3eI2Wm0xw8TK3cc" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-11">Start Free Trial</Button>
                </a>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <h3 className="text-2xl mb-2">Business</h3>
                <div className="mb-6">
                  <span className="text-4xl">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">White-label solution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">SLA guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Team training</span>
                  </li>
                </ul>
                <a href="https://buy.stripe.com/test_5kA9D6aSYdkg0nr5kl" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full h-11">Contact Sales</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">Can I change plans at any time?</h3>
                <p className="text-muted-foreground">
                  Yes, upgrade or downgrade anytime. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Pro plan includes 14-day free trial. No credit card required.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  All major credit cards, PayPal, and bank transfers for Business plan.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">
                  Yes, cancel anytime. No long-term contracts or cancellation fees.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">
                  30-day money-back guarantee on all paid plans.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade encryption. SOC 2 Type II certified.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Ready to Land More Brand Deals?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've already created their professional media kit pages
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="secondary" size="lg" className="h-11 px-8">
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
