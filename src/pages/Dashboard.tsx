import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserMemes } from "@/components/dashboard/UserMemes";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { Tuzemoon } from "@/components/dashboard/Tuzemoon";

const Dashboard = ({ activeSection = 'memes' }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main className="w-full">
          {activeSection === 'memes' && <UserMemes />}
          {activeSection === 'watchlist' && <Watchlist />}
          {activeSection === 'tuzemoon' && <Tuzemoon />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;