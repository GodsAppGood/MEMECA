import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserMemes } from "@/components/dashboard/UserMemes";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { ReferralProgram } from "@/components/dashboard/ReferralProgram";
import { useState } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'memes' | 'watchlist' | 'referral'>('memes');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main className="w-full">
          {activeSection === 'memes' && <UserMemes />}
          {activeSection === 'watchlist' && <Watchlist />}
          {activeSection === 'referral' && <ReferralProgram />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;