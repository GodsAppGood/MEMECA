import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { UserMemes } from "@/components/dashboard/UserMemes";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { ReferralProgram } from "@/components/dashboard/ReferralProgram";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'memes' | 'watchlist' | 'referral'>('memes');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16"> {/* Add padding top to account for fixed header */}
        <SidebarProvider>
          <div className="flex w-full">
            <div className="w-64 min-h-[calc(100vh-4rem)] overflow-y-auto sticky top-16"> {/* Add sticky positioning and top offset */}
              <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
            <main className="flex-1 p-6 overflow-y-auto">
              {activeSection === 'memes' && <UserMemes />}
              {activeSection === 'watchlist' && <Watchlist />}
              {activeSection === 'referral' && <ReferralProgram />}
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;