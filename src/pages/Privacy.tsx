import { Header } from "@/components/Header";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-700 mb-8">Last updated: January 1, 2025</p>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Who we are</h2>
          <p className="text-gray-700 mb-6">We are Works App, Inc., doing business as Creators. Our website address is: https://www.trycreators.ai</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Comments</h2>
          <p className="text-gray-700 mb-4">When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.</p>
          <p className="text-gray-700 mb-6">An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Media</h2>
          <p className="text-gray-700 mb-6">If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cookies</h2>
          <p className="text-gray-700 mb-4">If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p>
          <p className="text-gray-700 mb-4">If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p>
          <p className="text-gray-700 mb-4">When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p>
          <p className="text-gray-700 mb-6">If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Embedded content from other websites</h2>
          <p className="text-gray-700 mb-6">Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>
          <p className="text-gray-700 mb-6">These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Who we share your data with</h2>
          <p className="text-gray-700 mb-6">If you request a password reset, your IP address will be included in the reset email.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How long we retain your data</h2>
          <p className="text-gray-700 mb-4">If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.</p>
          <p className="text-gray-700 mb-6">For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What rights you have over your data</h2>
          <p className="text-gray-700 mb-6">If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Where your data is sent</h2>
          <p className="text-gray-700 mb-6">Visitor comments may be checked through an automated spam detection service.</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our contact address</h2>
          <div className="text-gray-700">
            <p>Works App, Inc.</p>
            <p>651 N Broad St,</p>
            <p>Suite 201,</p>
            <p>Middletown,</p>
            <p>DE 19709</p>
            <p>US</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-12 mt-20">
        <div className="container mx-auto px-4">
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
                    href="https://discord.gg/Cet49cDcSr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
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
}