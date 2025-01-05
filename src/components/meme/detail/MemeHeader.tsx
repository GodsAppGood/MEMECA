import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MemeHeaderProps {
  title: string;
  isFeatured: boolean;
}

export const MemeHeader = ({ title, isFeatured }: MemeHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-serif">{title}</h1>
      {isFeatured && (
        <Badge 
          className="bg-yellow-500 text-white animate-pulse"
          variant="secondary"
        >
          <Star className="w-4 h-4 mr-1" />
          Tuzemoon
        </Badge>
      )}
    </div>
  );
};