import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/meme/ImageUploader";
import { FormFields } from "@/components/meme/FormFields";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditMemeFormProps {
  meme: any;
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  onSave: () => void;
  onReset: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const EditMemeForm = ({
  meme,
  formData,
  setFormData,
  errors,
  setErrors,
  onSave,
  onReset,
  onClose,
  isLoading
}: EditMemeFormProps) => {
  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ImageUploader 
            imageUrl={formData.image_url} 
            onImageChange={handleImageChange} 
          />
        </div>
        <div className="space-y-4">
          <FormFields
            title={formData.title}
            setTitle={(value) => setFormData(prev => ({ ...prev, title: value }))}
            description={formData.description}
            setDescription={(value) => setFormData(prev => ({ ...prev, description: value }))}
            tradeLink={formData.trade_link}
            setTradeLink={(value) => setFormData(prev => ({ ...prev, trade_link: value }))}
            twitterLink={formData.twitter_link}
            setTwitterLink={(value) => setFormData(prev => ({ ...prev, twitter_link: value }))}
            telegramLink={formData.telegram_link}
            setTelegramLink={(value) => setFormData(prev => ({ ...prev, telegram_link: value }))}
            maxDescriptionLength={200}
          />
        </div>
      </div>
      <DialogFooter className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReset}
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
          onClick={onSave}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </div>
  );
};