import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

interface UseAuthStateChangeProps {
  setUser: (user: User | null) => void;
}

export const useAuthStateChange = ({ setUser }: UseAuthStateChangeProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
          return;
        }

        const user = {
          id: session.user.id,
          name: userData?.name || session.user.user_metadata.name || session.user.email,
          email: userData?.email || session.user.email,
          picture: userData?.profile_image || session.user.user_metadata.picture,
          profile_image: userData?.profile_image || session.user.user_metadata.picture,
          isAdmin: userData?.is_admin || false,
          is_admin: userData?.is_admin || false,
          email_confirmed: userData?.email_confirmed || false,
          is_verified: userData?.is_verified || false
        };

        setUser(user);
        toast({
          title: "Welcome!",
          description: `Successfully logged in as ${user.name}!`,
        });
        navigate('/my-memes');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, setUser]);
};