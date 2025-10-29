import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-4">Company Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Company:</strong> Works App, Inc.<br />
                <strong>Address:</strong> 651 N Broad St, Suite 201, Middletown, DE 19709 US<br />
                <strong>Website:</strong> <a href="https://www.trycreators.ai" className="text-primary hover:underline">https://www.trycreators.ai</a><br />
                <strong>Contact:</strong> <a href="mailto:alex@trycreators.ai" className="text-primary hover:underline">alex@trycreators.ai</a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Creators Media Kit ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily use the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained in the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials within the Service are provided "as is". Works App, Inc. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties. Further, Works App, Inc. does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">4. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Works App, Inc. or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if Works App, Inc. or a Works App, Inc. authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">5. Revisions and Errata</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing in the Service could include technical, typographical, or photographic errors. Works App, Inc. does not warrant that any of the materials on the Service are accurate, complete, or current. Works App, Inc. may make changes to the materials contained in the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">6. Payment and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Subscriptions are billed on a monthly basis through Stripe. We offer a 30-day money-back guarantee for all paid plans. You may cancel your subscription at any time through your account settings or by contacting support.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">7. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any claim relating to the Service shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <p className="text-sm text-muted-foreground">
                Last updated: January 1, 2025
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
