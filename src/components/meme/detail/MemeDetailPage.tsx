import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const memeId = parseInt(id || "", 10);

  const { data: meme, isLoading, error } = useQuery({
    queryKey: ["meme", memeId],
    queryFn: async () => {
      if (isNaN(memeId)) {
        throw new Error("Invalid meme ID");
      }
      
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", memeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !isNaN(memeId)
  });

  if (isNaN(memeId)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Invalid Meme ID</h1>
            <p className="mt-2">The meme ID provided is not valid.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="mt-2">{error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-500">Meme Not Found</h1>
            <p className="mt-2">The meme you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{meme.title}</h1>
          {meme.image_url && (
            <img 
              src={meme.image_url} 
              alt={meme.title}
              className="w-full rounded-lg shadow-lg mb-4"
            />
          )}
          <p className="text-gray-600 mb-4">{meme.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meme.blockchain && (
              <div>
                <h2 className="font-semibold">Blockchain:</h2>
                <p>{meme.blockchain}</p>
              </div>
            )}
            
            {meme.trade_link && (
              <div>
                <h2 className="font-semibold">Trade Link:</h2>
                <a 
                  href={meme.trade_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Trade Now
                </a>
              </div>
            )}
            
            {meme.twitter_link && (
              <div>
                <h2 className="font-semibold">Twitter:</h2>
                <a 
                  href={meme.twitter_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  View on Twitter
                </a>
              </div>
            )}
            
            {meme.telegram_link && (
              <div>
                <h2 className="font-semibold">Telegram:</h2>
                <a 
                  href={meme.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Join Telegram
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};