import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isEditing: boolean;
}

export const SubmitButton = ({ isEditing }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif text-lg py-6"
    >
      {isEditing ? "Save Changes" : "Submit Meme"}
    </Button>
  );
};