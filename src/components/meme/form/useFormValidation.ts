import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (title: string, description: string, imageUrl: string) => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title is required.",
      });
      return false;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Description is required.",
      });
      return false;
    }

    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image.",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};