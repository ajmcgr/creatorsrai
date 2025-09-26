import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import alexPortrait from "@/assets/alex-portrait.png";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="border border-[#e3e4e5] p-8 bg-white rounded-lg">
          <section className="mb-12">
            <h2 className="text-4xl font-reckless font-medium mb-6 text-gray-900 text-center">Our Story</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              I started this ranking to help people quickly understand who's trending on socials.
            </p>
          </section>

          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Hello there!</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In today's world, creators aren't just influencers, they're the new media companies. They drive cultural conversations, shift consumer behavior faster than traditional press ever could, and often set the agenda for how stories spread online.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tracking creators is no longer a "nice-to-have," it's essential. If you can't see who's shaping the narrative in real time, you're already behind.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              That's why I'm focused on building platforms that don't just catalogue journalists but map the entire creator economy. From YouTube to TikTok to Instagram, brands, founders, and storytellers can see who truly moves audiences.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The future of creators isn't about follower counts, it's about influence, trust, and how effectively they can build movements around ideas.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The lines between press, influencer, and entrepreneur are blurring. Tomorrow's most powerful media outlets will be individuals with a camera, a community, and a compelling story.
            </p>
            
            <div className="mb-6">
              <img 
                src={alexPortrait} 
                alt="Alex MacGregor" 
                className="w-24 h-24 object-cover"
              />
            </div>
            
            <p className="text-gray-900 font-medium mb-6">
              — Alex MacGregor<br />
              Editor, Creators 200
            </p>
            <a 
              href="https://x.com/Creators200" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Connect with me on X
            </a>
          </section>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Free Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/tools/engagement-calculator" className="text-gray-600 hover:text-primary transition-colors">Engagement Calculator</Link></li>
                <li><Link to="/tools/hashtag-generator" className="text-gray-600 hover:text-primary transition-colors">Hashtag Generator</Link></li>
                <li><Link to="/tools/content-planner" className="text-gray-600 hover:text-primary transition-colors">Content Planner</Link></li>
                <li><Link to="/tools/influencer-rate-calculator" className="text-gray-600 hover:text-primary transition-colors">Influencer Rate Calculator</Link></li>
                <li><Link to="/tools/roi-calculator" className="text-gray-600 hover:text-primary transition-colors">ROI Calculator</Link></li>
                <li><Link to="/tools/audience-demographics" className="text-gray-600 hover:text-primary transition-colors">Audience Demographics</Link></li>
                <li><Link to="/tools/campaign-tracker" className="text-gray-600 hover:text-primary transition-colors">Campaign Tracker</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://discord.gg/zH5GjPDT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/Creators200" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:alex@creatorsleaderboard.com" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center">
            <p className="text-sm text-gray-600">
              Copyright © 2025 Works App, Inc. Built with ♥️ by{" "}
              <a 
                href="https://x.com/Creators200" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Alex
              </a>
              {" "}and{" "}
              <a 
                href="https://works.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Works
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;