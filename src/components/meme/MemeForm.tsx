import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "./FormWrapper";
import { Meme } from "@/types/meme";

interface MemeFormProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
  initialData?: Meme | null;
  isEditMode?: boolean;
}

export const MemeForm = ({ 
  onSubmitAttempt, 
  isAuthenticated,
  initialData,
  isEditMode = false
}: MemeFormProps) => {
  const [formData, setFormData] = useState<Partial<Meme>>({});

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        blockchain: initialData.blockchain || "",
        twitter_link: initialData.twitter_link || "",
        telegram_link: initialData.telegram_link || "",
        trade_link: initialData.trade_link || "",
        image_url: initialData.image_url || "",
      });
    }
  }, [isEditMode, initialData]);

  return (
    <FormWrapper 
      onSubmitAttempt={onSubmitAttempt} 
      isAuthenticated={isAuthenticated}
      initialData={formData}
      isEditMode={isEditMode}
    />
  );
};