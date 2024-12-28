import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
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
            name: session.user.user_metadata.name || session.user.email,
            email: session.user.email || '',
            picture: session.user.user_metadata.picture || '',
            isAdmin: userData?.is_admin || false
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        const { data: userData } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture || '',
          isAdmin: userData?.is_admin || false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
};