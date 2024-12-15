import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tuzemoon as TuzemoonContent } from "@/components/dashboard/Tuzemoon";

const Tuzemoon = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TuzemoonContent />
      </main>
      <Footer />
    </div>
  );
};

export default Tuzemoon;