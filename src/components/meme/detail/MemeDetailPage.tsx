import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MemeHeader } from "./MemeHeader";
import { MemeImage } from "./MemeImage";
import { MemeLinks } from "./MemeLinks";
import { MemeActions } from "./MemeActions";
import { MemeMetadata } from "./MemeMetadata";
import { TooltipProvider } from "@/components/ui/tooltip";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;

      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", session.user.id)
        .maybeSingle();

      if (error) return false;
      return data?.is_admin || false;
    },
  });

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
              <MemeActions 
                meme={meme} 
                isAdmin={isAdmin || false} 
                onUpdate={refetch}
              />
            </div>

            <MemeImage
              meme={meme}
              className={meme.is_featured ? 'animate-float' : ''}
            />

            {meme.description && (
              <p className="text-lg mb-8 mt-6 break-words whitespace-pre-wrap max-w-full">
                {meme.description}
              </p>
            )}

            <MemeMetadata meme={meme} />
            <MemeLinks meme={meme} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MemeDetailPage;