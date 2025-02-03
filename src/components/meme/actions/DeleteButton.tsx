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

  // Проверяем, является ли пользователь админом
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No userId provided for admin check');
        return false;
      }
      console.log('Checking admin status for userId:', userId);
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      console.log('Admin check result:', data);
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  // Основная функция удаления
  const handleDelete = async () => {
    console.log('Delete initiated for meme:', {
      memeId: meme.id,
      userId,
      isAdmin,
      createdBy: meme.created_by
    });

    if (!userId) {
      console.error('No userId available');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete memes",
      });
      return;
    }

    if (!isAdmin && userId !== meme.created_by) {
      console.error('Permission denied:', {
        userId,
        isAdmin,
        memeCreator: meme.created_by
      });
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
      
      const { error } = await supabase
        .from('Memes')
        .delete()
        .eq('id', meme.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Meme deleted successfully:', meme.id);

      // Обновляем кэш после успешного удаления
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
    } catch (error) {
      console.error('Delete operation failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete meme. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Показываем кнопку только админам или создателю мема
  if (!userId || (!isAdmin && userId !== meme.created_by)) {
    console.log('Button hidden due to permissions:', {
      userId,
      isAdmin,
      memeCreator: meme.created_by
    });
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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