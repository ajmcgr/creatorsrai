import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "1 media kit",
      "Basic analytics",
      "Social media integration",
      "PDF export",
      "Email support",
    ],
    cta: "Get Started",
    ctaLink: "/auth?mode=signup",
    variant: "ghost" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Most popular for growing creators",
    features: [
      "Unlimited media kits",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Collaboration tools",
      "API access",
    ],
    cta: "Start Free Trial",
    ctaLink: "https://buy.stripe.com/test_4gw3eI2Wm0xw8TK3cc",
    variant: "default" as const,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For professional creators & agencies",
    features: [
      "Everything in Pro",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Team training",
    ],
    cta: "Contact Sales",
    ctaLink: "https://buy.stripe.com/test_5kA9D6aSYdkg0nr5kl",
    variant: "secondary" as const,
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes, upgrade or downgrade anytime. Changes take effect immediately.",
  },
  {
    question: "Is there a free trial?",
    answer: "Pro plan includes 14-day free trial. No credit card required.",
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Start free or upgrade for advanced features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`hover:shadow-lg transition-all relative ${
                plan.highlighted ? "border-2 border-primary shadow-lg hover:scale-105" : ""
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}
              <CardContent className="p-6">
                <h3 className="text-2xl mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.ctaLink.startsWith("http") ? (
                  <a href={plan.ctaLink} target="_blank" rel="noopener noreferrer">
                    <Button variant={plan.variant} className="w-full h-11">
                      {plan.cta}
                    </Button>
                  </a>
                ) : (
                  <Link to={plan.ctaLink}>
                    <Button variant={plan.variant} className="w-full h-11">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
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
