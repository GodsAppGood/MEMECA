import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { MemeCardActions } from "../MemeCardActions";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { WatchlistButton } from "../actions/WatchlistButton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useFeatureToggle } from "@/hooks/useFeatureToggle";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          
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

  const { data: meme, isLoading, refetch } = useQuery({
    queryKey: ["meme", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Meme not found");
      return data;
    },
  });

  useRealtimeSubscription(
    [
      { name: 'Memes' },
      { name: 'Watchlist' }
    ],
    () => {
      void refetch();
    }
  );

  const { handleFeatureToggle } = useFeatureToggle(id || '', meme?.is_featured || false);

  const handleTuzemoonClick = async () => {
    if (!meme) return;

    try {
      const tuzemoonUntil = !meme.is_featured 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: !meme.is_featured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", meme.id);

      if (error) throw error;

      await handleFeatureToggle();
      toast({
        title: meme.is_featured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
        description: meme.is_featured 
          ? "The meme has been removed from Tuzemoon" 
          : "The meme has been added to Tuzemoon for 24 hours",
      });
    } catch (error) {
      console.error("Error toggling Tuzemoon status:", error);
      toast({
        title: "Error",
        description: "Failed to update Tuzemoon status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Meme not found</h2>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
                  <>
                    <WatchlistButton 
                      memeId={meme.id.toString()} 
                      userId={userId} 
                      showText={true}
                      className="mr-2"
                    />
                    <Button
                      variant="outline"
                      onClick={handleTuzemoonClick}
                      className={`group ${meme.is_featured ? 'text-yellow-500' : ''}`}
                    >
                      <Moon className={`h-5 w-5 mr-2 ${meme.is_featured ? 'fill-current' : ''}`} />
                      {meme.is_featured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
                    </Button>
                  </>
                )}
                <MemeCardActions
                  meme={meme}
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
      </div>
    </TooltipProvider>
  );
};

export default MemeDetailPage;