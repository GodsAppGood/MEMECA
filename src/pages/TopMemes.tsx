import { Header } from "@/components/Header";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const TopMemes = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Top 200 Memes</h1>
          <MemeGrid showTopOnly={true} />
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default TopMemes;