import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthHeader from "@/components/AuthHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, supabaseUrl, supabaseAnonKey } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    period: "/month",
    description: "Perfect to get started",
    billingInfo: "Forever free",
    features: [
      "1 media kit",
      "Professional media kit page builder",
      "Custom branded URL",
      "ROI & rate calculators",
      "Email sharing",
    ],
    cta: "Current Plan",
    ctaLink: "/auth?mode=signup",
    variant: "outline" as const,
    highlighted: true,
    planKey: "free",
  },
  {
    name: "Pro Plan",
    price: "$19",
    period: "/month",
    description: "Everything you need to land brand deals",
    billingInfo: "Cancel anytime • Billed monthly",
    features: [
      "Up to 5 media kits",
      "Professional template designs",
      "Custom branded URL",
      "Mobile-responsive design",
      "Real-time analytics & view tracking",
      "PDF export & Canva integration",
      "Unlimited stats refreshes",
      "Remove Creators branding",
    ],
    cta: "Upgrade Now",
    ctaLink: "https://buy.stripe.com/dRm3cx1oy1Zl0YWaSjg3602",
    variant: "default" as const,
    highlighted: false,
    badge: "Most Popular",
    showStripe: true,
    planKey: "pro",
  },
  {
    name: "Business Plan",
    price: "$49",
    period: "/month",
    description: "For agencies & serious creators",
    billingInfo: "Cancel anytime • Billed monthly",
    featuresHeader: "Everything in Pro, plus:",
    features: [
      "Up to 20 media kits",
      "Professional template designs",
      "Custom branded URL",
      "Mobile-responsive design",
      "Real-time analytics & view tracking",
      "PDF export & Canva integration",
      "Unlimited stats refreshes",
      "Remove Creators branding",
      "Priority support",
      "Dedicated account manager",
      "Advanced analytics dashboard",
      "Custom domain support",
    ],
    cta: "Upgrade Now",
    ctaLink: "https://buy.stripe.com/3cIcN78R07jF4b82lNg3603",
    variant: "default" as const,
    highlighted: false,
    showStripe: true,
    planKey: "business",
  },
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes, upgrade or downgrade anytime. Changes take effect immediately.",
  },
  {
    question: "Is there a free trial?",
    answer: "Both Pro and Business plans include a 7-day free trial. No credit card required.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "All major credit cards, PayPal, and bank transfers for Business plan.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, cancel anytime. No long-term contracts or cancellation fees.",
  },
  {
    question: "Do you offer refunds?",
    answer: "30-day money-back guarantee on all paid plans.",
  },
  {
    question: "Is my data secure?",
    answer: "Enterprise-grade encryption. SOC 2 Type II certified.",
  },
];

const Upgrade = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Fetch user's current plan
  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) {
        setUserPlan('free');
        return;
      }
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserPlan(data?.plan || 'free');
      } catch (err) {
        console.error("Error fetching plan:", err);
        setUserPlan('free');
      }
    };
    
    fetchPlan();
  }, [user]);

  const [searchParams] = useSearchParams();

  // If returning from Stripe with a session_id, verify and upgrade immediately
  useEffect(() => {
    const sid = searchParams.get('session_id');
    if (!sid) return;

    const run = async () => {
      try {
        // Try supabase client first
        let ok = false;
        try {
          const res = await supabase.functions.invoke('verify-payment', {
            body: { session_id: sid },
          });
          if (!res.error && res.data?.success) ok = true;
        } catch (_) {
          // ignore
        }

        if (!ok) {
          // Fallback direct fetch
          const resp = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
            },
            body: JSON.stringify({ session_id: sid })
          });
          if (resp.ok) {
            const data = await resp.json();
            ok = !!data?.success;
          }
        }

        if (ok) {
          setUserPlan('pro');
          toast.success('Payment verified — you are now Pro');
        } else {
          console.error('Verify payment failed');
        }
      } catch (e) {
        console.error('Verify payment error', e);
      }
    };

    run();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {user ? <AuthHeader showSettings showUpgrade={false} /> : <Header />}
      
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Start free or upgrade for advanced features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan) => {
            const isCurrent = userPlan === plan.planKey;
            return (
              <Card
                key={plan.name}
                className={`hover:shadow-lg transition-all relative ${
                  plan.highlighted ? "border-2 border-primary" : ""
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.billingInfo}</p>

                  {isCurrent ? (
                    <Button variant="outline" className="w-full h-11 mb-8" disabled>
                      Current Plan
                    </Button>
                  ) : plan.ctaLink.startsWith("http") ? (
                    <a href={plan.ctaLink} target="_blank" rel="noopener noreferrer" className="block mb-8">
                      <Button variant={plan.variant} className="w-full h-11">
                        {plan.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link to={plan.ctaLink} className="block mb-8">
                      <Button variant={plan.variant} className="w-full h-11">
                        {plan.cta}
                      </Button>
                    </Link>
                  )}

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">{plan.featuresHeader || "What's Included"}</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.showStripe && (
                    <p className="text-xs text-muted-foreground text-center mt-6">
                      Secure checkout powered by Stripe
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardContent className="p-6">
                  <h3 className="text-xl mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upgrade;
