import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isEditing: boolean;
  isLoading: boolean;
}

export const SubmitButton = ({ isEditing, isLoading }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-[#FFB74D] hover:bg-[#FFB74D]/90 font-serif text-lg py-6 text-black"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Saving..." : "Submitting..."}
        </>
      ) : (
        isEditing ? "Save Changes" : "Submit Meme"
      )}
    </Button>
  );
};