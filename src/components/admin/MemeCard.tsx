import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star } from "lucide-react";
import { Meme } from "@/types/meme";

interface MemeCardProps {
  meme: Meme;
  onEdit: (meme: Meme) => void;
  onDelete: (memeId: number) => void;
  onTuzemoonToggle: (meme: Meme) => void;
}

export const MemeCard = ({ meme, onEdit, onDelete, onTuzemoonToggle }: MemeCardProps) => {
  return (
    <Card key={meme.id} className="overflow-hidden">
      <CardContent className="p-4">
        <img
          src={meme.image_url || ''}
          alt={meme.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="font-serif text-lg mb-2">{meme.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{meme.description}</p>
        <div className="flex gap-2 mb-4">
          <Button
            variant={meme.is_featured ? "default" : "outline"}
            size="sm"
            onClick={() => onTuzemoonToggle(meme)}
          >
            <Star className={`h-4 w-4 mr-2 ${meme.is_featured ? "fill-current" : ""}`} />
            {meme.is_featured ? "Remove from Tuzemoon" : "Add to Tuzemoon"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(meme)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(meme.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};