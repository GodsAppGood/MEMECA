import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MemeHeader } from "./MemeHeader";
import { MemeImageDisplay } from "./MemeImageDisplay";
import { DescriptionSection } from "./DescriptionSection";
import { BlockchainInfo } from "./BlockchainInfo";
import { ExternalLink } from "./ExternalLink";
import { MemeActions } from "./MemeActions";
import { WatchlistButton } from "../actions/WatchlistButton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

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
              <MemeHeader meme={meme} />
              <div className="flex gap-2">
                {(isAdmin || isVerified) && (
                  <WatchlistButton 
                    memeId={meme.id.toString()} 
                    userId={userId} 
                    showText={true}
                    className="mr-2"
                  />
                )}
                <MemeActions 
                  meme={meme} 
                  isAdmin={isAdmin} 
                  onUpdate={refetch}
                />
              </div>
            </div>

            <MemeImageDisplay imageUrl={meme.image_url} title={meme.title} />
            <DescriptionSection description={meme.description} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlockchainInfo blockchain={meme.blockchain} />
              <ExternalLink type="Trade" url={meme.trade_link} />
              <ExternalLink type="Twitter" url={meme.twitter_link} />
              <ExternalLink type="Telegram" url={meme.telegram_link} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MemeDetailPage;