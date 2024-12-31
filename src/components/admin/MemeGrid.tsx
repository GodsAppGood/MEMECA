import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MemeGridProps {
  onEdit: (meme: any) => void;
}

export const MemeGrid = ({ onEdit }: MemeGridProps) => {
  const queryClient = useQueryClient();

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => JSON.parse(localStorage.getItem("memes") || "[]"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (memeId: string) => {
      const currentMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = currentMemes.filter((meme: any) => meme.id !== memeId);
      localStorage.setItem("memes", JSON.stringify(updatedMemes));
      return updatedMemes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast.success("Meme deleted successfully");
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {memes.map((meme: any) => (
        <Card key={meme.id} className="overflow-hidden">
          <CardContent className="p-4">
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-serif text-lg mb-2">{meme.title}</h3>
            <p className="text-sm text-gray-600">{meme.description}</p>
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
              onClick={() => deleteMutation.mutate(meme.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};