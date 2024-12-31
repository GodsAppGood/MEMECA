import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { StatsCards } from "@/components/admin/StatsCards";
import { MemeGrid } from "@/components/admin/MemeGrid";
import { EditMemeDialog } from "@/components/admin/EditMemeDialog";

const AdminDashboard = () => {
  const [editingMeme, setEditingMeme] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        <StatsCards />
        <MemeGrid onEdit={setEditingMeme} />
        
        {editingMeme && (
          <EditMemeDialog
            meme={editingMeme}
            isOpen={!!editingMeme}
            onClose={() => setEditingMeme(null)}
          />
        )}
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default AdminDashboard;