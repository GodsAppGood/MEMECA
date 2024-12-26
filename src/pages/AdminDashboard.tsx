import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/admin/StatsCards";
import { MemeCard } from "@/components/admin/MemeCard";
import { Meme } from "@/types/meme";

const AdminDashboard = () => {
  const [editingMeme, setEditingMeme] = useState<Meme | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast.success("Logged out of admin panel");
    navigate('/');
  };

  const deleteMutation = useMutation({
    mutationFn: async (memeId: number) => {
      const { error } = await supabase
        .from('Memes')
        .delete()
        .eq('id', memeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Meme deleted successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedMeme: Meme) => {
      const { error } = await supabase
        .from('Memes')
        .update(updatedMeme)
        .eq('id', updatedMeme.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      setEditingMeme(null);
      toast.success("Meme updated successfully");
    },
  });

  const toggleTuzemoonMutation = useMutation({
    mutationFn: async ({ memeId, isFeatured }: { memeId: number, isFeatured: boolean }) => {
      const tuzemoonUntil = !isFeatured 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('Memes')
        .update({ 
          is_featured: !isFeatured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq('id', memeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Tuzemoon status updated successfully");
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/submit')}
              className="flex items-center gap-2"
            >
              Submit Meme
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <StatsCards userCount={users.length} memeCount={memes.length} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memes.map((meme: Meme) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              onEdit={setEditingMeme}
              onDelete={(memeId) => deleteMutation.mutate(memeId)}
              onTuzemoonToggle={(meme) => toggleTuzemoonMutation.mutate({ 
                memeId: meme.id, 
                isFeatured: meme.is_featured || false 
              })}
            />
          ))}
        </div>
      </main>

      <Dialog open={!!editingMeme} onOpenChange={(open) => !open && setEditingMeme(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meme</DialogTitle>
          </DialogHeader>
          {editingMeme && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={editingMeme.title}
                  onChange={(e) => setEditingMeme({ ...editingMeme, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={editingMeme.description || ''}
                  onChange={(e) => setEditingMeme({ ...editingMeme, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Trade Link</label>
                <Input
                  value={editingMeme.trade_link || ''}
                  onChange={(e) => setEditingMeme({ ...editingMeme, trade_link: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Twitter Link</label>
                <Input
                  value={editingMeme.twitter_link || ''}
                  onChange={(e) => setEditingMeme({ ...editingMeme, twitter_link: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telegram Link</label>
                <Input
                  value={editingMeme.telegram_link || ''}
                  onChange={(e) => setEditingMeme({ ...editingMeme, telegram_link: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditingMeme(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateMutation.mutate(editingMeme)}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Support />
      <Footer />
    </div>
  );
};

export default AdminDashboard;