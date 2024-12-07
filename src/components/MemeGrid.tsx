import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const MemeGrid = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return storedMemes
        .filter((meme: any) => (meme.likes || 0) > 0)
        .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 200);
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
      
      // Sort and limit to 200 top memes
      const sortedMemes = updatedMemes
        .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 200);
      
      localStorage.setItem("memes", JSON.stringify(sortedMemes));
      return sortedMemes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white -ml-4"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {memes.map((meme: any) => (
            <Card 
              key={meme.id} 
              className={cn(
                "flex-shrink-0 w-[350px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 relative",
                "first:ml-0"
              )}
            >
              <Link to={`/meme/${meme.id}`}>
                <CardContent className="p-0">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className="w-full h-[250px] object-cover"
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

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white -mr-4"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};