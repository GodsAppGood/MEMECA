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
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  const handleDelete = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete memes",
      });
      return;
    }

    try {
      setIsDeleting(true);
      console.log('Attempting to delete meme:', {
        memeId: meme.id,
        userId,
        isAdmin
      });

      // Конвертируем ID в число
      const memeId = parseInt(meme.id);
      if (isNaN(memeId)) {
        throw new Error('Invalid meme ID');
      }

      // Удаляем мем - триггер сам очистит связанные данные
      const { error: deleteError } = await supabase
        .from('Memes')
        .delete()
        .eq('id', memeId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      console.log('Meme deleted successfully:', memeId);

      // Инвалидируем все связанные запросы
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

  // Показываем кнопку только если пользователь админ или владелец мема
  if (!userId || (!isAdmin && userId !== meme.created_by)) {
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