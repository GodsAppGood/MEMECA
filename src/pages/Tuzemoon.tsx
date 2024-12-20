import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { Tuzemoon as TuzemoonContent } from "@/components/dashboard/Tuzemoon";

const Tuzemoon = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <TuzemoonContent />
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Tuzemoon;