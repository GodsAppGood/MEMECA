import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EditButtonProps {
  meme: {
    id: string;
    created_by?: string;
  };
  userId: string | null;
}

export const EditButton = ({ meme, userId }: EditButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    localStorage.setItem("editingMeme", JSON.stringify(meme));
    navigate("/submit");
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