import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
            isAdmin: userData?.is_admin || false,
            email_confirmed: true
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
          isAdmin: userData?.is_admin || false,
          email_confirmed: true
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Failed to log out",
      });
    }
  };

  return { user, isLoading, handleLogout };
};