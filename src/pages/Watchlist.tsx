import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Watchlist = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: likedMemes } = useQuery({
    queryKey: ["liked-memes"],
    queryFn: () => {
      const storedLikes = JSON.parse(localStorage.getItem("liked-memes") || "[]");
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return storedMemes.filter((meme: any) => storedLikes.includes(meme.id));
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (memeId: string) => {
      const storedLikes = JSON.parse(localStorage.getItem("liked-memes") || "[]");
      const updatedLikes = storedLikes.filter((id: string) => id !== memeId);
      localStorage.setItem("liked-memes", JSON.stringify(updatedLikes));
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liked-memes"] });
      toast({
        title: "Success",
        description: "Meme removed from watchlist",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">My Watchlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedMemes?.map((meme: any) => (
            <Card key={meme.id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif">{meme.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => unlikeMutation.mutate(meme.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="mt-2 text-sm text-gray-600">{meme.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Watchlist;