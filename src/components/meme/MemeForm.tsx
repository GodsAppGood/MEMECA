import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormWrapper } from "./FormWrapper";
import { Meme } from "@/types/meme";
import { useToast } from "@/hooks/use-toast";
import { useMemeDetails } from "@/hooks/useMemeDetails";

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
  isEditMode = false,
}: MemeFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Meme>>({});
  
  const { data: fetchedMeme, isLoading, error } = useMemeDetails(id);

  useEffect(() => {
    if (id) {
      // If we have initialData from navigation state, use it
      if (initialData) {
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
      // Otherwise, use the fetched data
      else if (fetchedMeme) {
        setFormData({
          title: fetchedMeme.title,
          description: fetchedMeme.description || "",
          blockchain: fetchedMeme.blockchain || "",
          twitter_link: fetchedMeme.twitter_link || "",
          telegram_link: fetchedMeme.telegram_link || "",
          trade_link: fetchedMeme.trade_link || "",
          image_url: fetchedMeme.image_url || "",
        });
      }
    }
  }, [id, initialData, fetchedMeme]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meme data. Please try again.",
      });
      navigate(-1);
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormWrapper 
      onSubmitAttempt={onSubmitAttempt} 
      isAuthenticated={isAuthenticated}
      initialData={formData}
      isEditMode={isEditMode}
    />
  );
};