import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditMemeDialogProps {
  meme: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMemeDialog = ({ meme, isOpen, onClose }: EditMemeDialogProps) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedMeme: any) => {
      const currentMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = currentMemes.map((m: any) => 
        m.id === updatedMeme.id ? updatedMeme : m
      );
      localStorage.setItem("memes", JSON.stringify(updatedMemes));
      return updatedMemes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      onClose();
      toast.success("Meme updated successfully");
    },
  });

  const handleSave = () => {
    updateMutation.mutate(meme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Meme</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={meme?.title}
              onChange={(e) => meme && (meme.title = e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={meme?.description}
              onChange={(e) => meme && (meme.description = e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};