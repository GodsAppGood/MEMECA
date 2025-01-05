import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Meme } from "@/types/meme";

export const useMemeDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["meme", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Meme not found");
      
      return {
        ...data,
        id: data.id.toString()
      } as Meme;
    },
    enabled: !!id,
  });
};