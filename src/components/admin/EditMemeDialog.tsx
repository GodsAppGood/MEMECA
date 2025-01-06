import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/meme/ImageUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateMemeTitle, validateDescription, validateUrl } from "@/utils/validation";

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
    image_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meme && isOpen) {
      setFormData({
        title: meme.title || "",
        description: meme.description || "",
        blockchain: meme.blockchain || "",
        twitter_link: meme.twitter_link || "",
        telegram_link: meme.telegram_link || "",
        trade_link: meme.trade_link || "",
        image_url: meme.image_url || "",
      });
      setErrors({});
    }
  }, [meme, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const titleError = validateMemeTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const descError = validateDescription(formData.description);
    if (descError) newErrors.description = descError;

    if (formData.twitter_link) {
      const twitterError = validateUrl(formData.twitter_link);
      if (twitterError) newErrors.twitter_link = twitterError;
    }

    if (formData.telegram_link) {
      const telegramError = validateUrl(formData.telegram_link);
      if (telegramError) newErrors.telegram_link = telegramError;
    }

    if (formData.trade_link) {
      const tradeError = validateUrl(formData.trade_link);
      if (tradeError) newErrors.trade_link = tradeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!validateForm()) {
        throw new Error("Please fix the form errors before submitting");
      }

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
    onError: (error: any) => {
      console.error('Error updating meme:', error);
      toast.error(error.message || "Failed to update meme");
    }
  });

  const handleSave = () => {
    updateMutation.mutate();
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
        image_url: meme.image_url || "",
      });
      setErrors({});
    }
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Meme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploader 
              imageUrl={formData.image_url} 
              onImageChange={handleImageChange} 
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
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
                className={errors.twitter_link ? "border-red-500" : ""}
              />
              {errors.twitter_link && (
                <p className="text-sm text-red-500 mt-1">{errors.twitter_link}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Telegram Link</label>
              <Input
                value={formData.telegram_link}
                onChange={(e) => setFormData(prev => ({ ...prev, telegram_link: e.target.value }))}
                className={errors.telegram_link ? "border-red-500" : ""}
              />
              {errors.telegram_link && (
                <p className="text-sm text-red-500 mt-1">{errors.telegram_link}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Trade Link</label>
              <Input
                value={formData.trade_link}
                onChange={(e) => setFormData(prev => ({ ...prev, trade_link: e.target.value }))}
                className={errors.trade_link ? "border-red-500" : ""}
              />
              {errors.trade_link && (
                <p className="text-sm text-red-500 mt-1">{errors.trade_link}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              type="button"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            type="button"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};