import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EditMemeDialogProps {
  meme: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMemeDialog = ({ meme, isOpen, onClose }: EditMemeDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blockchain: "",
    twitter_link: "",
    telegram_link: "",
    trade_link: "",
  });

  useEffect(() => {
    if (meme && isOpen) {
      setFormData({
        title: meme.title || "",
        description: meme.description || "",
        blockchain: meme.blockchain || "",
        twitter_link: meme.twitter_link || "",
        telegram_link: meme.telegram_link || "",
        trade_link: meme.trade_link || "",
      });
    }
  }, [meme, isOpen]);

  const updateMutation = useMutation({
    mutationFn: async (updatedMeme: any) => {
      const { error } = await supabase
        .from('Memes')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', meme.id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      onClose();
      toast.success("Meme updated successfully");
    },
    onError: (error) => {
      console.error('Error updating meme:', error);
      toast.error("Failed to update meme");
    }
  });

  const handleSave = () => {
    updateMutation.mutate(meme);
  };

  const handleReset = () => {
    if (meme) {
      setFormData({
        title: meme.title || "",
        description: meme.description || "",
        blockchain: meme.blockchain || "",
        twitter_link: meme.twitter_link || "",
        telegram_link: meme.telegram_link || "",
        trade_link: meme.trade_link || "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Meme</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Blockchain</label>
            <Input
              value={formData.blockchain}
              onChange={(e) => setFormData(prev => ({ ...prev, blockchain: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Twitter Link</label>
            <Input
              value={formData.twitter_link}
              onChange={(e) => setFormData(prev => ({ ...prev, twitter_link: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Telegram Link</label>
            <Input
              value={formData.telegram_link}
              onChange={(e) => setFormData(prev => ({ ...prev, telegram_link: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Trade Link</label>
            <Input
              value={formData.trade_link}
              onChange={(e) => setFormData(prev => ({ ...prev, trade_link: e.target.value }))}
            />
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
