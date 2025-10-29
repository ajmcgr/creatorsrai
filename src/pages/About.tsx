import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our story</h1>
            <p className="text-xl text-muted-foreground">
              We started this to help content creators quickly showcase their work and land brand deals faster with professional media kit pages.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <p className="text-lg leading-relaxed mb-6">
                Hello there!
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                In today's world, creators aren't just influencers—they're the new media companies. They drive cultural conversations, shift consumer behavior faster than traditional press ever could, and often set the agenda for how stories spread online.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Having a professional media kit page is no longer a "nice-to-have," it's essential. If you can't present your value and audience insights in a polished way, you're leaving money on the table.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Step forward, Creators Media Kit. We help you build beautiful media kit pages and generate AI-powered pitch emails in minutes—so you can focus on creating while we help you close deals.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Our small team works around the clock, propelled by a simple goal: help you do great creator work without the busywork. We'd rather invest in product improvements than flashy marketing; rather answer a customer email than craft another sales pitch.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                If you've got feedback, ideas, or just want to say hi, drop me a note. We're here to help.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Enjoy!
              </p>
              
              <div className="mt-8 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div>
                  <p className="font-bold text-xl">— Alex MacGregor</p>
                  <p className="text-muted-foreground">Founder, Creators Media Kit</p>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
