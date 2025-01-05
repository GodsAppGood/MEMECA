import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { EditMemeDialog } from "@/components/admin/EditMemeDialog";

interface EditButtonProps {
  meme: {
    id: string;
    created_by?: string | null;
  };
  userId: string | null;
}

export const EditButton = ({ meme, userId }: EditButtonProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(true);
  };

  if (userId !== meme.created_by) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        className="hover:text-blue-500"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <EditMemeDialog 
        meme={meme}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};