import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Welcome to our meme calendar platform, where creativity meets community.
          </p>
          <p className="text-lg">
            Our mission is to provide a space for meme enthusiasts to discover, share, 
            and track the latest trends in the meme ecosystem.
          </p>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default About;