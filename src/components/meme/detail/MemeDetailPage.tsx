import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MemeHeader } from "./MemeHeader";
import { MemeImage } from "./MemeImage";
import { MemeLinks } from "./MemeLinks";
import { MemeCardActions } from "../MemeCardActions";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { userPoints, userLikes, refetchLikes } = useUserData(userId);

  const { data: meme, isLoading, error, refetch } = useQuery({
    queryKey: ["meme", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error("Meme not found");
      
      return {
        ...data,
        id: data.id.toString()
      };
    },
    enabled: !!id
  });

  useRealtimeSubscription(
    [{ name: "Memes" }, { name: "Watchlist" }],
    () => {
      void refetch();
      void refetchLikes();
    }
  );

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

  if (error || !meme) {
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
            <h1 className="text-3xl font-serif">{meme.title}</h1>
            <MemeCardActions
              meme={meme}
              userLikes={userLikes}
              userPoints={userPoints}
              userId={userId}
            />
          </div>

          <img
            src={meme.image_url}
            alt={meme.title}
            className="w-full h-auto max-h-[600px] object-contain mb-8 rounded-lg"
          />

          {meme.description && (
            <p className="text-lg mb-8">{meme.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meme.blockchain && (
              <div>
                <h3 className="font-serif text-lg mb-2">Blockchain</h3>
                <p className="capitalize">{meme.blockchain}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-serif text-lg mb-2">Date Added</h3>
              <p>{format(new Date(meme.created_at), 'PPP')}</p>
            </div>

            <MemeLinks meme={meme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetailPage;