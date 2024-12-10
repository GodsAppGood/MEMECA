import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meme, isLoading } = useQuery({
    queryKey: ["memes", id],
    queryFn: () => {
      const memes = JSON.parse(localStorage.getItem("memes") || "[]");
      return memes.find((m: any) => m.id === id);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = storedMemes.map((m: any) => {
        if (m.id === id) {
          return { ...m, likes: (m.likes || 0) + 1 };
        }
        return m;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Add to watchlist
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      if (!watchlist.includes(id)) {
        watchlist.push(id);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast({
        title: "Success",
        description: "Meme added to your watchlist",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!meme) {
    return <div>Meme not found</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full h-auto max-h-[600px] object-contain mb-8 rounded-lg"
          />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif">{meme.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => likeMutation.mutate()}
              className="hover:text-red-500"
            >
              <Heart className={`h-6 w-6 ${meme.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-2">{meme.likes || 0}</span>
            </Button>
          </div>

          <p className="text-lg mb-8">{meme.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-lg mb-2">Blockchain</h3>
              <p className="capitalize">{meme.blockchain}</p>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-2">Date Added</h3>
              <p>{new Date(meme.dateAdded).toLocaleDateString()}</p>
            </div>
            {meme.tradeLink && (
              <div>
                <h3 className="font-serif text-lg mb-2">Trade Link</h3>
                <a 
                  href={meme.tradeLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline flex items-center"
                >
                  Trade <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
            {meme.twitterLink && (
              <div>
                <h3 className="font-serif text-lg mb-2">Twitter</h3>
                <a 
                  href={meme.twitterLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline flex items-center"
                >
                  Twitter <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
            {meme.telegramLink && (
              <div>
                <h3 className="font-serif text-lg mb-2">Telegram</h3>
                <a 
                  href={meme.telegramLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline flex items-center"
                >
                  Telegram <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MemeDetail;