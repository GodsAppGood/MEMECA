import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteButtonProps {
  meme: {
    id: string;
    created_by?: string | null;
  };
  userId: string | null;
}

export const DeleteButton = ({ meme, userId }: DeleteButtonProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("=== Starting Delete Operation ===");
    console.log("Meme ID:", meme.id);
    console.log("Current User ID:", userId);
    console.log("Meme Creator ID:", meme.created_by);
    console.log("Is Admin:", isAdmin);

    if (!userId) {
      console.log("Delete failed: User not logged in");
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete memes",
      });
      return;
    }

    if (!isAdmin && userId !== meme.created_by) {
      console.log("Delete failed: User doesn't have permission");
      toast({
        variant: "destructive",
        title: "Error",
        description: "You don't have permission to delete this meme",
      });
      return;
    }

    try {
      setIsDeleting(true);
      console.log('Attempting to delete meme:', meme.id);
      
      // Check for likes before deletion
      const { data: likes, error: likesError } = await supabase
        .from('Likes')
        .select('id')
        .eq('meme_id', parseInt(meme.id));
        
      console.log("Likes found:", likes?.length || 0);
      if (likesError) {
        console.error("Error checking likes:", likesError);
      }

      // Optimistically update UI
      queryClient.setQueryData(["memes"], (oldData: any) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.filter((m: any) => m.id !== meme.id);
      });

      const { error } = await supabase
        .from('Memes')
        .delete()
        .eq('id', parseInt(meme.id));

      if (error) {
        console.error("Delete operation failed:", error);
        console.log("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      console.log("Delete operation successful");

      // Invalidate relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] })
      ]);

      toast({
        title: "Success",
        description: "Meme deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting meme:', error);
      console.log("Full error object:", JSON.stringify(error, null, 2));
      
      // Revert optimistic update by refetching data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] })
      ]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete meme. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Only show delete button for admin users or the meme creator
  if (!userId || (!isAdmin && userId !== meme.created_by)) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()} // Prevent navigation
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent navigation */}
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Meme</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this meme? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};