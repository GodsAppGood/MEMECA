import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (title: string, description: string, imageUrl: string, isEditMode: boolean = false) => {
    // Trim strings to check for empty content
    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    let errors: string[] = [];

    if (!trimmedTitle) {
      errors.push("Title");
    }

    if (!trimmedDescription) {
      errors.push("Description");
    }

    // Only check for image in create mode
    if (!imageUrl && !isEditMode) {
      errors.push("Image");
    }

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please complete all required fields: ${errors.join(", ")}.`,
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};