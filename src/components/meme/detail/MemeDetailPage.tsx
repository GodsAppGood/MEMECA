import { useParams } from "react-router-dom";
import { useMemeDetails } from "@/hooks/useMemeDetails";
import { MemeHeader } from "./MemeHeader";
import { MemeImageDisplay } from "./MemeImageDisplay";
import { MemeMetadata } from "./MemeMetadata";
import { MemeLinks } from "./MemeLinks";
import { MemeActions } from "./MemeActions";
import { MemeAIAnalysis } from "../MemeAIAnalysis";
import { MemeStats } from "./MemeStats";
import { useUserRole } from "@/hooks/useUserRole";

interface MemeHeaderProps {
  title: string;
  description?: string | null;
}

interface MemeImageDisplayProps {
  imageUrl?: string | null;
  title: string;
}

interface MemeActionsProps {
  id: number | string;
  isFeatured?: boolean | null;
}

export const MemeDetailPage = () => {
  const { id } = useParams();
  const { data: meme, isLoading, error } = useMemeDetails(id);
  const { isVerified } = useUserRole();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Error loading meme
          </h1>
          <p className="text-gray-600">
            {error?.message || "Meme not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <MemeHeader title={meme.title} description={meme.description} />
        <MemeImageDisplay imageUrl={meme.image_url} title={meme.title} />
        
        <MemeStats memeId={Number(meme.id)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <MemeMetadata meme={meme} />
            <MemeLinks meme={meme} />
            <MemeActions id={meme.id} isFeatured={meme.is_featured} />
          </div>
          {isVerified && (
            <div>
              <MemeAIAnalysis memeId={meme.id.toString()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};