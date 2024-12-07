import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { UserMemes } from "@/components/dashboard/UserMemes";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { ReferralProgram } from "@/components/dashboard/ReferralProgram";
import { useState } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'memes' | 'watchlist' | 'referral'>('memes');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
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