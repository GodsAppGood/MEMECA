import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return;
      }

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
          return;
        }

        setUser({
          id: session.user.id,
          name: userData?.name || session.user.user_metadata.name || session.user.email,
          email: userData?.email || session.user.email,
          picture: userData?.profile_image || session.user.user_metadata.picture,
          profile_image: userData?.profile_image || session.user.user_metadata.picture,
          isAdmin: userData?.is_admin || false,
          is_admin: userData?.is_admin || false,
          email_confirmed: userData?.email_confirmed || false,
          is_verified: userData?.is_verified || false
        });
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  return { user, isLoading, setUser };
};