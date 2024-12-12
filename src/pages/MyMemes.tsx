import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { MemeGrid } from "@/components/MemeGrid";

const MyMemes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">My Memes</h1>
        <MemeGrid userOnly={true} />
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyMemes;