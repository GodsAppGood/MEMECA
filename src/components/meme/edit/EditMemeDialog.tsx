import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateMemeTitle, validateDescription, validateUrl } from "@/utils/validation";
import { EditMemeForm } from "./EditMemeForm";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Meme</DialogTitle>
        </DialogHeader>
        <EditMemeForm
          meme={meme}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSave={handleSave}
          onReset={handleReset}
          onClose={onClose}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};