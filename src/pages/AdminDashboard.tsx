import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Users, UserPlus, Clock, ChartBar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [editingMeme, setEditingMeme] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const queryClient = useQueryClient();

  // Query for total users
  const { data: totalUsers = 0 } = useQuery({
    queryKey: ["total-users"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("Users")
        .select("*", { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Query for users today
  const { data: usersToday = 0 } = useQuery({
    queryKey: ["users-today"],
    queryFn: async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count, error } = await supabase
        .from("Sessions")
        .select("user_id", { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString())
        .unique();
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Set up realtime subscription for active users
  useEffect(() => {
    const channel = supabase.channel('active-users')
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const uniqueUsers = new Set(
          Object.values(presenceState)
            .flat()
            .map((presence: any) => presence.user_id)
        );
        setActiveUsers(uniqueUsers.size);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => JSON.parse(localStorage.getItem("memes") || "[]"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (memeId: string) => {
      const currentMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = currentMemes.filter((meme: any) => meme.id !== memeId);
      localStorage.setItem("memes", JSON.stringify(updatedMemes));
      return updatedMemes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Meme deleted successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedMeme: any) => {
      const currentMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = currentMemes.map((meme: any) => 
        meme.id === updatedMeme.id ? updatedMeme : meme
      );
      localStorage.setItem("memes", JSON.stringify(updatedMemes));
      return updatedMemes;
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
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users Now</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Existing Memes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memes.map((meme: any) => (
            <Card key={meme.id} className="overflow-hidden">
              <CardContent className="p-4">
                <img
                  src={meme.imageUrl}
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
