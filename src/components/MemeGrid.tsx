import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface MemeProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
}

export const MemeGrid = ({ selectedDate, selectedBlockchain }: MemeProps) => {
  const queryClient = useQueryClient();

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return storedMemes.map((meme: any) => ({
        ...meme,
        likes: meme.likes || 0,
      }));
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (memeId: string) => {
      const currentMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = currentMemes.map((meme: any) => {
        if (meme.id === memeId) {
          return { ...meme, likes: (meme.likes || 0) + 1 };
        }
        return meme;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));
      return updatedMemes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const filteredMemes = memes.filter((meme: any) => {
    const dateMatch = !selectedDate || new Date(meme.date).toDateString() === selectedDate.toDateString();
    const blockchainMatch = !selectedBlockchain || meme.blockchain === selectedBlockchain;
    return dateMatch && blockchainMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMemes.map((meme: any) => (
          <Card key={meme.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 relative">
            <Link to={`/meme/${meme.id}`}>
              <CardContent className="p-0">
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="w-full h-64 object-cover"
                />
              </CardContent>
              <CardFooter className="p-4 bg-secondary/5">
                <div>
                  <h3 className="font-serif text-lg mb-2">{meme.title}</h3>
                  <p className="text-sm text-gray-600">{meme.description}</p>
                </div>
              </CardFooter>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                likeMutation.mutate(meme.id);
              }}
            >
              <Heart className="h-5 w-5" fill={meme.likes > 0 ? "red" : "none"} />
              {meme.likes > 0 && (
                <span className="absolute -bottom-4 text-xs font-bold">
                  {meme.likes}
                </span>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};