import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 prose prose-lg max-w-4xl">
        <h1 className="text-4xl font-serif mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Welcome to MemeCatLandar!</h2>
          <p>
            MemeCatLandar is a platform where users can share, discover, and interact with meme content.
            By using our services, you agree to these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Our Services</h2>
          <ul>
            <li>Meme submission and viewing</li>
            <li>Content filtering and organization</li>
            <li>Paid promotion opportunities</li>
            <li>User interaction features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">User Responsibilities</h2>
          <p>As a user, you agree to:</p>
          <ul>
            <li>Not post illegal or harmful content</li>
            <li>Respect intellectual property rights</li>
            <li>Not engage in spamming or harassment</li>
            <li>Maintain the security of your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Paid Promotions</h2>
          <p>For promoted content:</p>
          <ul>
            <li>All payments are non-refundable</li>
            <li>Promoted content must follow our content guidelines</li>
            <li>We reserve the right to reject promotional requests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Updates to Terms</h2>
          <p>
            We may update these terms from time to time. We will notify users of any significant changes.
            Continued use of the platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
          <p>For support or questions, please contact: <a href="mailto:anitos2189@gmail.com">anitos2189@gmail.com</a></p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;