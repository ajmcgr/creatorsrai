import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Twitter as TwitterIcon, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Twitter = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 mb-6">
              <TwitterIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Twitter/X Media Kit Creator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Build a professional Twitter/X media kit featuring your follower count, engagement rate, and tweet performance.
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg">
                Create Your Twitter Media Kit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Twitter/X-Specific Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Account Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Display key Twitter metrics that demonstrate your influence.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Follower count & growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Tweet impressions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Engagement rate</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Top Tweets</h3>
                  <p className="text-muted-foreground mb-4">
                    Showcase your most successful tweets and threads.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Viral tweets showcase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Thread performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Retweet & like stats</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Showcase Your Twitter Influence?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your professional Twitter/X media kit page now
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="secondary" size="lg">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Twitter;
