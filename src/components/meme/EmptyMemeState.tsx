import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyMemeStateProps {
  isUserOnly?: boolean;
}

export const EmptyMemeState = ({ isUserOnly }: EmptyMemeStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isUserOnly 
            ? "You have not created any memes yet. Add your first meme to see it here!"
            : "No memes found. Try using different filters."}
        </AlertDescription>
      </Alert>
      {isUserOnly && (
        <Button 
          onClick={() => navigate('/submit')}
          className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105"
        >
          Create Your First Meme
        </Button>
      )}
    </div>
  );
};