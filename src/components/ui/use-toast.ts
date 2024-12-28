import { useToast as useToastOriginal, toast } from "@/hooks/use-toast";

export const useToast = () => {
  try {
    return useToastOriginal();
  } catch (error) {
    console.error('Toast error:', error);
    return {
      toast: () => {},
      dismiss: () => {},
      toasts: []
    };
  }
};

export { toast };