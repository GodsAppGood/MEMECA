import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: meme } = useQuery({
    queryKey: ["memes", id],
    queryFn: () => {
      const memes = JSON.parse(localStorage.getItem("memes") || "[]");
      return memes.find((m: any) => m.id === id);
    },
  });

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
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full h-auto max-h-[600px] object-contain mb-8 rounded-lg"
          />
          <h1 className="text-3xl font-serif mb-4">{meme.title}</h1>
          <p className="text-lg mb-6">{meme.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-lg mb-2">Blockchain</h3>
              <p>{meme.blockchain}</p>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-2">Date</h3>
              <p>{meme.date}</p>
            </div>
            {meme.twitterLink && (
              <div>
                <h3 className="font-serif text-lg mb-2">Twitter</h3>
                <a href={meme.twitterLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {meme.twitterLink}
                </a>
              </div>
            )}
            {meme.telegramLink && (
              <div>
                <h3 className="font-serif text-lg mb-2">Telegram</h3>
                <a href={meme.telegramLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {meme.telegramLink}
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