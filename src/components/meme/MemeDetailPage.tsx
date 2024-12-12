import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: meme, isLoading } = useQuery({
    queryKey: ["meme-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!meme) {
    return <div>Meme not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-auto max-h-[600px] object-contain mb-8 rounded-lg"
        />
        
        <h1 className="text-3xl font-serif mb-6">{meme.title}</h1>
        <p className="text-lg mb-8">{meme.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-serif text-lg mb-2">Blockchain</h3>
            <p className="capitalize">{meme.blockchain}</p>
          </div>
          {meme.trade_link && (
            <div>
              <h3 className="font-serif text-lg mb-2">Trade Link</h3>
              <a 
                href={meme.trade_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline flex items-center"
              >
                Trade <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
          {meme.twitter_link && (
            <div>
              <h3 className="font-serif text-lg mb-2">Twitter</h3>
              <a 
                href={meme.twitter_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline flex items-center"
              >
                Twitter <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
          {meme.telegram_link && (
            <div>
              <h3 className="font-serif text-lg mb-2">Telegram</h3>
              <a 
                href={meme.telegram_link} 
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
    </div>
  );
};