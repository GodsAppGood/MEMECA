import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MemeNotFoundProps {
  message?: string;
}

export const MemeNotFound = ({ message = "Meme not found" }: MemeNotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <Button onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back
      </Button>
    </div>
  );
};