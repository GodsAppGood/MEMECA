import { Header } from "@/components/Header";
import { TopMemeGrid } from "@/components/meme/TopMemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { WheelWidget } from "@/components/wheel/WheelWidget";

const TopMemes = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="w-full">
          <div className="relative w-full flex justify-center items-center mb-8">
            <img 
              src="/lovable-uploads/1861cd68-fda4-40a0-8623-dbd9f17f048e.png"
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
      <WheelWidget />
      <Footer />
    </div>
  );
};

export default TopMemes;