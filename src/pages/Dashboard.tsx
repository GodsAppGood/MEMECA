import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6">
          <TransactionHistory />
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Dashboard;