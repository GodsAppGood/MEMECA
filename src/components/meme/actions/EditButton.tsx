import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Meme } from "@/types/meme";

interface EditButtonProps {
  meme: Meme;
  userId: string | null;
}

export const EditButton = ({ meme, userId }: EditButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to edit memes",
      });
      return;
    }

    if (userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only edit your own memes",
      });
      return;
    }

    console.log("Editing meme:", {
      memeId: meme.id,
      userId,
      createdBy: meme.created_by
    });

    navigate('/submit', { 
      state: { 
        editMode: true, 
        memeData: {
          ...meme,
          id: meme.id.toString()
        }
      } 
    });
  };

  // Only show edit button if user is the creator
  if (!userId || userId !== meme.created_by) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleEdit}
      className="hover:text-blue-500"
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
};