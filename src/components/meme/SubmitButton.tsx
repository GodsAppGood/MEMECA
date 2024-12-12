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
      className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif text-lg py-6"
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