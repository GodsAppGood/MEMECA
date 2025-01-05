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
    
    if (userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only edit your own memes",
      });
      return;
    }

    // Navigate to submit form with meme data in state
    navigate('/submit', { state: { editMode: true, memeData: meme } });
  };

  if (userId !== meme.created_by) return null;

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