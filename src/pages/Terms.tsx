import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Privacy Policy Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>This Privacy Policy explains how we collect, use, and protect your information when you use our services.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6">
                <li>Personal information you provide to us</li>
                <li>Usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We may use your information to:</p>
              <ul className="list-disc pl-6">
                <li>Provide and maintain our services</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you</li>
                <li>Monitor usage and analyze trends</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>We take reasonable measures to protect your information from unauthorized access, use, or disclosure.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6">
                <li>Access your personal information</li>
                <li>Request correction of your information</li>
                <li>Request deletion of your information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:anitos2189@gmail.com" className="text-[#F5A623] hover:underline">anitos2189@gmail.com</a></p>
            </div>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section>
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to MemeCatLandar!</h2>
              <p>MemeCatLandar is a platform where users can share, discover, and interact with meme content. By using our services, you agree to these terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
              <ul className="list-disc pl-6">
                <li>Meme submission and viewing</li>
                <li>Content filtering and organization</li>
                <li>Paid promotion opportunities</li>
                <li>User interaction features</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p>As a user, you agree to:</p>
              <ul className="list-disc pl-6">
                <li>Not post illegal or harmful content</li>
                <li>Respect intellectual property rights</li>
                <li>Not engage in spamming or harassment</li>
                <li>Maintain the security of your account</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Paid Promotions</h2>
              <p>For promoted content:</p>
              <ul className="list-disc pl-6">
                <li>All payments are non-refundable</li>
                <li>Promoted content must follow our content guidelines</li>
                <li>We reserve the right to reject promotional requests</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Updates to Terms</h2>
              <p>We may update these terms from time to time. We will notify users of any significant changes. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>For support or questions, please contact: <a href="mailto:anitos2189@gmail.com" className="text-[#F5A623] hover:underline">anitos2189@gmail.com</a></p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;