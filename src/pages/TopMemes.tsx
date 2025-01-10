import { Header } from "@/components/Header";
import { TopMemeGrid } from "@/components/meme/TopMemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const TopMemes = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="w-full">
          <div className="relative w-full flex justify-center items-center mb-8">
            <img 
              src="/lovable-uploads/083b4dc6-2daa-4c81-90c8-9981b1e4ade2.png"
              alt="Top 200 Memes Banner"
              className="w-full h-auto object-contain max-h-[300px]"
              loading="eager"
            />
          </div>
          <div className="container mx-auto px-4">
            <TopMemeGrid />
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default TopMemes;