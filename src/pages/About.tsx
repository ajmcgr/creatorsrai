import { Header } from "@/components/Header";
import alexPortrait from "@/assets/alex-portrait.png";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg mx-auto">
          <h1 className="font-display text-4xl font-bold mb-8 text-gray-900">About</h1>
          
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I started this leaderboard to help people quickly understand who's trending on socials.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">About me</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-48 flex-shrink-0">
                <img 
                  src={alexPortrait} 
                  alt="Alex MacGregor" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hello there!
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I'm Alex MacGregor, a PR strategist who has spent the last decade relying on enterprise suites like Meltwater, Cision, and Muck Rack to get coverage for tech brands across Asia-Pacific.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Now, I'm building the future of PR & Influence.
                </p>
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
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="border-t bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
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
      </footer>
    </div>
  );
};

export default About;