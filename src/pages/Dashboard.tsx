import { Footer } from "@/components/Footer";
import { UserMemes } from "@/components/dashboard/UserMemes";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { useState } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'memes' | 'watchlist'>('memes');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <main className="w-full">
          {activeSection === 'memes' && <UserMemes />}
          {activeSection === 'watchlist' && <Watchlist />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;