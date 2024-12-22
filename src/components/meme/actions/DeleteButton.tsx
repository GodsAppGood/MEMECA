import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { useQueryClient } from "@tanstack/react-query";

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only delete your own memes",
      });
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('Memes')
        .delete()
        .eq('id', meme.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      await queryClient.invalidateQueries({ queryKey: ["user-memes"] });

      toast({
        title: "Success",
        description: "Meme deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting meme:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete meme",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (userId !== meme.created_by) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your meme.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};