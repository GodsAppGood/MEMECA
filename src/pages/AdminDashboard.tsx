import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, LogOut, Users, BarChart3, Star, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [editingMeme, setEditingMeme] = useState<any>(null);
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
    mutationFn: async (memeId: string) => {
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
    mutationFn: async (updatedMeme: any) => {
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
    mutationFn: async ({ memeId, isFeatured }: { memeId: string, isFeatured: boolean }) => {
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

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ memeId, userId }: { memeId: string, userId: string }) => {
      const { data: existingLike, error: checkError } = await supabase
        .from('Likes')
        .select('*')
        .eq('meme_id', memeId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        const { error } = await supabase
          .from('Likes')
          .delete()
          .eq('meme_id', memeId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Likes')
          .insert([{ meme_id: memeId, user_id: userId }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Like status updated successfully");
    },
  });

  const toggleWatchlistMutation = useMutation({
    mutationFn: async ({ memeId, userId }: { memeId: string, userId: string }) => {
      const { data: existingWatch, error: checkError } = await supabase
        .from('Watchlist')
        .select('*')
        .eq('meme_id', memeId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingWatch) {
        const { error } = await supabase
          .from('Watchlist')
          .delete()
          .eq('meme_id', memeId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Watchlist')
          .insert([{ meme_id: memeId, user_id: userId }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Watchlist status updated successfully");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{users.length}</h2>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{memes.length}</h2>
                <p className="text-gray-600">Total Memes</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memes.map((meme: any) => (
            <Card key={meme.id} className="overflow-hidden">
              <CardContent className="p-4">
                <img
                  src={meme.image_url}
                  alt={meme.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-serif text-lg mb-2">{meme.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{meme.description}</p>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={meme.is_featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTuzemoonMutation.mutate({ 
                      memeId: meme.id, 
                      isFeatured: meme.is_featured 
                    })}
                  >
                    <Star className={`h-4 w-4 mr-2 ${meme.is_featured ? "fill-current" : ""}`} />
                    {meme.is_featured ? "Remove from Tuzemoon" : "Add to Tuzemoon"}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingMeme(meme)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(meme.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
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
                  value={editingMeme.description}
                  onChange={(e) => setEditingMeme({ ...editingMeme, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Trade Link</label>
                <Input
                  value={editingMeme.trade_link}
                  onChange={(e) => setEditingMeme({ ...editingMeme, trade_link: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Twitter Link</label>
                <Input
                  value={editingMeme.twitter_link}
                  onChange={(e) => setEditingMeme({ ...editingMeme, twitter_link: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telegram Link</label>
                <Input
                  value={editingMeme.telegram_link}
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