import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Hero />
        <Filters />
        <div className="container mx-auto px-4 py-8">
          <MemeGrid />
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Index;