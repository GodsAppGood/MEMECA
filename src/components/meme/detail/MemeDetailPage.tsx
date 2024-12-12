import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MemeHeader } from "./MemeHeader";
import { MemeImage } from "./MemeImage";
import { MemeLinks } from "./MemeLinks";
import { MemeCardActions } from "../MemeCardActions";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";

export const MemeDetailPage = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { userPoints, userLikes, refetchLikes } = useUserData(userId);

  const { data: meme, refetch } = useQuery({
    queryKey: ["meme", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        id: data.id.toString()
      };
    }
  });

  useRealtimeSubscription(
    [{ name: "Memes" }, { name: "Watchlist" }],
    () => {
      void refetch();
      void refetchLikes();
    }
  );

  if (!meme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <MemeHeader meme={meme} />
        <MemeImage meme={meme} />
        <MemeLinks meme={meme} />
        <MemeCardActions 
          meme={meme}
          userLikes={userLikes}
          userPoints={userPoints}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default MemeDetailPage;