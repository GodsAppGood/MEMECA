import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, LogOut, Users, BarChart3 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
                <p className="text-sm text-gray-600">{meme.description}</p>
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