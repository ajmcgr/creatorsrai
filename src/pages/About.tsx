import Header from "@/components/Header";
import Footer from "@/components/Footer";
import founderPhoto from "@/assets/founder-photo.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      {/* About Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Letter Content with Header Inside */}
          <div className="border border-border rounded-lg p-8 md:p-12 space-y-6 text-foreground bg-background">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-medium mb-6">Our story</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We started this to help content creators quickly showcase their work and land brand deals faster with professional media kit pages.
              </p>
            </div>

            <p className="text-lg font-semibold">Hello there!</p>

            <p className="text-lg leading-relaxed">
              In today's world, creators aren't just influencers—they're the new media companies. They drive cultural conversations, shift consumer behavior faster than traditional press ever could, and often set the agenda for how stories spread online.
            </p>

            <p className="text-lg leading-relaxed">
              Having a professional media kit page is no longer a "nice-to-have," it's essential. If you can't present your value and audience insights in a polished way, you're leaving money on the table.
            </p>

            <p className="text-lg leading-relaxed">
              Step forward, Creators Media Kit. We help you build beautiful media kit pages and generate AI-powered pitch emails in minutes—so you can focus on creating while we help you close deals.
            </p>

            <p className="text-lg leading-relaxed">
              Our small team works around the clock, propelled by a simple goal: help you do great creator work without the busywork. We'd rather invest in product improvements than flashy marketing; rather answer a customer email than craft another sales pitch.
            </p>

            <p className="text-lg leading-relaxed">
              If you've got feedback, ideas, or just want to say hi, drop me a note. We're here to help.
            </p>

            <p className="text-lg leading-relaxed">Enjoy!</p>

            {/* Signature Section */}
            <div className="mt-12 pt-8">
              <div className="flex flex-col items-start gap-4">
                <img
                  src={founderPhoto}
                  alt="Alex MacGregor"
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">— Alex MacGregor</p>
                  <p className="text-muted-foreground mb-3">Founder, Creators Media Kit</p>
                  <a
                    href="https://x.com/trycreators"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Connect with me on X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
