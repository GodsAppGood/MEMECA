import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative">
        <main className="container mx-auto px-4 py-8 prose prose-lg max-w-4xl">
          <h1 className="text-4xl font-serif mb-8">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, and protect your information when you use our services, 
              including integration with third-party authentication providers such as Google OAuth.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Information We Collect</h2>
            <h3 className="text-xl font-serif mb-2">Personal Information You Provide to Us</h3>
            <ul>
              <li>When you use Google OAuth to sign in or register, we collect your name, email address, and profile picture provided by Google.</li>
              <li>Additional information you may choose to provide (e.g., Watchlist preferences, submitted memes).</li>
            </ul>
            
            <h3 className="text-xl font-serif mb-2 mt-4">Usage Data and Analytics</h3>
            <p>We collect data about your interactions with our site, such as pages visited, actions performed, and time spent.</p>
            
            <h3 className="text-xl font-serif mb-2 mt-4">Cookies and Tracking Technologies</h3>
            <p>We use cookies to improve your experience, such as keeping you logged in and personalizing content.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">How We Use Your Information</h2>
            <ul>
              <li>Authenticate and verify your identity using Google OAuth.</li>
              <li>Provide and maintain our services.</li>
              <li>Improve and personalize your experience.</li>
              <li>Communicate with you about updates, new features, or promotions.</li>
              <li>Monitor site usage and analyze trends for better service delivery.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Data Security</h2>
            <p>
              We take reasonable and industry-standard measures to protect your information from unauthorized access, 
              use, or disclosure. Sensitive data such as access tokens provided by Google OAuth are stored securely 
              and not exposed to unauthorized parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Third-Party Services</h2>
            <ul>
              <li>By using Google OAuth, you agree to the privacy policies of Google. You can review Google's Privacy Policy at: 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://policies.google.com/privacy
                </a>
              </li>
              <li>We do not share your information with other third-party services unless required for the functionality of our platform or by law.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
            <ul>
              <li>Access your personal information.</li>
              <li>Request correction of your information.</li>
              <li>Request deletion of your information (subject to technical limitations and legal requirements).</li>
              <li>Revoke permissions granted via Google OAuth by managing your connected apps in your Google Account settings.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any changes by posting the updated policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at: 
              <a href="mailto:anitos2189@gmail.com" className="text-blue-600 hover:underline ml-1">
                anitos2189@gmail.com
              </a>
            </p>
          </section>
        </main>
        
        <div className="fixed top-32 right-8 w-64 h-64 lg:w-80 lg:h-80">
          <img
            src="/lovable-uploads/f06c7230-5d4d-42b4-b93c-0d469e7af951.png"
            alt="Privacy Policy Illustration"
            className="w-full h-full object-contain animate-float"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;