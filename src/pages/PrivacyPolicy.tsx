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
            <h2 className="text-2xl font-serif mb-4">Data Collection and Usage</h2>
            <p>We collect the following information when you use MemeCatLandar:</p>
            <ul>
              <li>Name and email address (from Google OAuth)</li>
              <li>Profile picture (from Google OAuth)</li>
              <li>Usage data and interactions with the platform</li>
              <li>Content you submit (memes and related information)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">How We Use Your Data</h2>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To personalize your experience</li>
              <li>To communicate with you about updates and changes</li>
              <li>To process your transactions for promoted content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Data Protection</h2>
            <p>We implement industry-standard security measures to protect your data, including:</p>
            <ul>
              <li>Encryption of sensitive information</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data</li>
              <li>Revoke access permissions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
            <p>For privacy-related inquiries, please contact us at: <a href="mailto:anitos2189@gmail.com">anitos2189@gmail.com</a></p>
          </section>
        </main>
        
        <div className="fixed top-32 right-8 w-64 h-64 lg:w-80 lg:h-80">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Privacy Policy Illustration"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
