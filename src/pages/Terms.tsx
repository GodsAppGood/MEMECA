import { Header } from "@/components/Header";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Privacy & Terms</h1>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to MemeCatlandar.io. These terms and conditions outline the rules and regulations
              for the use of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Privacy Policy</h2>
            <p className="mb-4">
              We respect your privacy and are committed to protecting your personal data. Our privacy
              policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Content</h2>
            <p className="mb-4">
              Users are responsible for the content they submit to the platform. Content must not
              violate any applicable laws or infringe on third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, unless uploaded by users, is the property of
              MemeCatlandar.io and is protected by copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              MemeCatlandar.io shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of any
              changes by updating the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us through our official
              channels.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;