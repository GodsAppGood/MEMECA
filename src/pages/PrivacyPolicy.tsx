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
              This Privacy Policy explains how we collect, use, and protect your information when you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Information We Collect</h2>
            <ul>
              <li>Personal information you provide to us</li>
              <li>Usage data and analytics</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">How We Use Your Information</h2>
            <p>We may use your information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you</li>
              <li>Monitor usage and analyze trends</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of your information</li>
              <li>Request deletion of your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:anitos2189@gmail.com">anitos2189@gmail.com</a></p>
          </section>
        </main>
        
        <div className="fixed top-32 right-8 w-64 h-64 lg:w-80 lg:h-80">
          <img
            src="/lovable-uploads/4d506355-26e6-4469-ad4b-81d89dbd2e8e.png"
            alt="Privacy Policy Illustration"
            className="w-full h-full object-cover rounded-lg shadow-lg animate-float"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
