import { Header } from "@/components/Header";
import alexPortrait from "@/assets/alex-portrait.png";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="border border-[#e3e4e5] p-8 bg-white">
          <section className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 text-center">Our Story</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              I started this leaderboard to help people quickly understand who's trending on socials.
            </p>
          </section>

          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Hello there!</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              I'm Alex MacGregor, a PR strategist who has spent the last decade relying on enterprise suites like Meltwater, Cision, and Muck Rack to get coverage for tech brands across Asia-Pacific.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Now, I'm building the future of PR & Influence.
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
              Founder, Creators
            </p>
            <a 
              href="https://www.linkedin.com/in/alexmacgregor2/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Connect with me on LinkedIn
            </a>
          </section>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://discord.gg/Cet49cDcSr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Free Tools</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Engagement Calculator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Hashtag Generator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Content Planner</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Influencer Finder</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">ROI Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="http://x.com/alexmacgregor__/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center">
            <p className="text-sm text-gray-600">
              Copyright © 2025 Works App, Inc. Built with ♥️ by{" "}
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