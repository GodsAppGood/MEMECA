import { useParams } from "react-router-dom";
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
import { BackButton } from "../ui/BackButton";
import { MemeNotFound } from "../ui/MemeNotFound";
import { ContainerLayout } from "../layout/ContainerLayout";
import { useMemeDetails } from "@/hooks/useMemeDetails";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const { userId, isVerified, isAdmin, isLoading: isRoleLoading, error: roleError } = useUserRole();
  const { 
    data: meme, 
    isLoading: isMemeLoading, 
    error: memeError,
    refetch 
  } = useMemeDetails(id);

  if (isRoleLoading || isMemeLoading) {
    return <LoadingSpinner />;
  }

  if (roleError) {
    return <ErrorState error={roleError} />;
  }

  if (memeError) {
    return <ErrorState 
      error={memeError instanceof Error ? memeError : new Error("Failed to load meme")} 
      onRetry={() => refetch()} 
    />;
  }

  if (!meme) {
    return <MemeNotFound />;
  }

  return (
    <TooltipProvider>
      <ContainerLayout>
        <BackButton className="mb-8" />

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <MemeHeader title={meme.title} isFeatured={meme.is_featured} />
            <MemeActions
              memeId={meme.id.toString()}
              memeTitle={meme.title}
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
      </ContainerLayout>
    </TooltipProvider>
  );
};

export default MemeDetailPage;