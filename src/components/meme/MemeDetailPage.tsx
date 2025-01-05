import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";
import { MemeCardActions } from "./MemeCardActions";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { WatchlistButton } from "./actions/WatchlistButton";
import { TooltipProvider } from "@/components/ui/tooltip";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          
          // Fetch user role information
          const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('is_verified, is_admin')
            .eq('auth_id', session.user.id)
            .single();
          
          if (!userError && userData) {
            setIsVerified(userData.is_verified);
            setIsAdmin(userData.is_admin);
            console.log('User roles:', { isVerified: userData.is_verified, isAdmin: userData.is_admin });
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    void getSession();
  }, []);

  const { userPoints, userLikes, refetchLikes } = useUserData(userId);

  const { data: meme, isLoading, refetch } = useQuery({
    queryKey: ["meme-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        id: data.id.toString()
      };
    }
  });

  useRealtimeSubscription(
    [
      { name: 'Memes' },
      { name: 'Watchlist' }
    ],
    () => {
      void refetch();
      void refetchLikes();
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!meme) {
    return <div>Meme not found</div>;
  }

  return (
    <TooltipProvider>
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
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-serif">{meme.title}</h1>
            <div className="flex gap-2">
              {(isAdmin || isVerified) && (
                <WatchlistButton 
                  memeId={meme.id} 
                  userId={userId} 
                  showText={true}
                  className="mr-2"
                />
              )}
              <MemeCardActions
                meme={meme}
                userLikes={userLikes}
                userPoints={userPoints}
                userId={userId}
              />
            </div>
          </div>

          <img
            src={meme.image_url}
            alt={meme.title}
            className="w-full h-auto max-h-[600px] object-contain mb-8 rounded-lg"
          />
          
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
    </TooltipProvider>
  );
};