import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const [editingMeme, setEditingMeme] = useState<any>(null);
  const [deleteConfirmMeme, setDeleteConfirmMeme] = useState<any>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to access the admin dashboard");
        navigate("/");
        return;
      }

      const { data: userData, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", session.user.id)
        .single();

      if (error || !userData?.is_admin) {
        toast.error("Unauthorized access");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Fetch memes with proper error handling
  const { data: memes = [], isLoading, error } = useQuery({
    queryKey: ["memes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Delete mutation with confirmation
  const deleteMutation = useMutation({
    mutationFn: async (memeId: number) => {
      const { error } = await supabase
        .from("Memes")
        .delete()
        .eq("id", memeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Meme deleted successfully");
      setDeleteConfirmMeme(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete meme: ${error.message}`);
    }
  });

  // Update mutation with validation
  const updateMutation = useMutation({
    mutationFn: async (updatedMeme: any) => {
      const { error } = await supabase
        .from("Memes")
        .update({
          title: updatedMeme.title,
          description: updatedMeme.description,
          is_featured: updatedMeme.is_featured
        })
        .eq("id", updatedMeme.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      setEditingMeme(null);
      toast.success("Meme updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update meme: ${error.message}`);
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load memes: {(error as any).message}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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
                    onClick={() => setDeleteConfirmMeme(meme)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
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
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmMeme} onOpenChange={(open) => !open && setDeleteConfirmMeme(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmMeme?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmMeme(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleteConfirmMeme.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Support />
      <Footer />
    </div>
  );
};

export default AdminDashboard;