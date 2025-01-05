import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MemeHeader } from "./MemeHeader";
import { MemeImageDisplay } from "./MemeImageDisplay";
import { DescriptionSection } from "./DescriptionSection";
import { BlockchainInfo } from "./BlockchainInfo";
import { ExternalLinks } from "./ExternalLinks";
import { MemeActions } from "./MemeActions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorState } from "../ui/ErrorState";
import { useUserRole } from "@/hooks/useUserRole";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, isVerified, isAdmin, isLoading: isRoleLoading, error: roleError } = useUserRole();

  const { 
    data: meme, 
    isLoading: isMemeLoading, 
    error: memeError,
    refetch 
  } = useQuery({
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

  if (isRoleLoading || isMemeLoading) {
    return <LoadingSpinner />;
  }

  if (roleError) {
    return <ErrorState error={roleError} />;
  }

  if (memeError) {
    return <ErrorState error={memeError instanceof Error ? memeError : new Error("Failed to load meme")} onRetry={() => refetch()} />;
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
              <MemeHeader title={meme.title} isFeatured={meme.is_featured} />
              <MemeActions
                memeId={meme.id.toString()}
                userId={userId}
                isAdmin={isAdmin}
                isVerified={isVerified}
                isFeatured={meme.is_featured}
                onUpdate={refetch}
              />
            </div>

            <MemeImageDisplay imageUrl={meme.image_url} title={meme.title} />
            <DescriptionSection description={meme.description} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlockchainInfo blockchain={meme.blockchain} />
              <ExternalLinks 
                tradeLink={meme.trade_link}
                twitterLink={meme.twitter_link}
                telegramLink={meme.telegram_link}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MemeDetailPage;