import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MemeHeader } from "./MemeHeader";
import { MemeImage } from "./MemeImage";
import { MemeLinks } from "./MemeLinks";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: meme, isLoading, refetch } = useQuery({
    queryKey: ["meme", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;

      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", session.user.id)
        .single();

      if (error) return false;
      return data?.is_admin || false;
    },
  });

  const handleTuzemoonToggle = async () => {
    try {
      const tuzemoonUntil = meme?.is_featured 
        ? null 
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Convert Date to ISO string

      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: !meme?.is_featured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", id);

      if (error) throw error;

      await refetch();
      toast({
        title: meme?.is_featured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
        description: meme?.is_featured 
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
            <div className="space-y-2">
              <h1 className="text-3xl font-serif">{meme.title}</h1>
              {meme.is_featured && (
                <Badge 
                  className="bg-yellow-500 text-white animate-pulse"
                  variant="secondary"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Tuzemoon
                </Badge>
              )}
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleTuzemoonToggle}
                className={`group ${meme.is_featured ? 'text-yellow-500' : ''}`}
              >
                <Star className={`h-5 w-5 mr-2 ${meme.is_featured ? 'fill-current' : ''}`} />
                {meme.is_featured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
              </Button>
            )}
          </div>

          <MemeImage
            meme={meme}
            className={meme.is_featured ? 'animate-float' : ''}
          />

          {meme.description && (
            <p className="text-lg mb-8 mt-6">{meme.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {meme.blockchain && (
              <div>
                <h3 className="font-serif text-lg mb-2">Blockchain</h3>
                <p className="capitalize">{meme.blockchain}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-serif text-lg mb-2">Date Added</h3>
              <p>{meme.created_at ? format(new Date(meme.created_at), 'PPP') : 'N/A'}</p>
            </div>

            <MemeLinks meme={meme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetailPage;