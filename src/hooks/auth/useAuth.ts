import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
            auth_id: session.user.id,
            name: session.user.user_metadata.name || session.user.email,
            email: session.user.email || '',
            picture: session.user.user_metadata.picture || '',
            profile_image: userData?.profile_image || session.user.user_metadata.picture || '',
            isAdmin: userData?.is_admin || false,
            is_admin: userData?.is_admin || false,
            email_confirmed: userData?.email_confirmed || false
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
        navigate('/');
      } else if (session?.user) {
        const { data: userData } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          auth_id: session.user.id,
          name: session.user.user_metadata.name || session.user.email,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture || '',
          profile_image: userData?.profile_image || session.user.user_metadata.picture || '',
          isAdmin: userData?.is_admin || false,
          is_admin: userData?.is_admin || false,
          email_confirmed: userData?.email_confirmed || false
        });

        toast({
          title: "Welcome!",
          description: `Successfully logged in as ${session.user.user_metadata.name || session.user.email}!`,
        });

        navigate('/my-memes');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLoginSuccess = async (response: any) => {
    try {
      if (response.credential) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) throw error;
      }
      setIsLoginOpen(false);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please try again later",
      });
    }
  };

  const handleLoginError = () => {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Please try again or contact support if the problem persists.",
    });
    setIsLoginOpen(false);
  };

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
        description: error.message,
      });
    }
  };

  return {
    user,
    isLoading,
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout
  };
};