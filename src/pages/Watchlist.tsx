import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { Watchlist as WatchlistContent } from "@/components/dashboard/Watchlist";
import { MemeWheelWidget } from "@/components/MemeWheelWidget";

const Watchlist = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <WatchlistContent />
      </main>
      <Support />
      <Footer />
      <MemeWheelWidget />
    </div>
  );
};

export default Watchlist;