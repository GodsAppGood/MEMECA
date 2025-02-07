
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Session initialization
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name || 'Anonymous User',
            email: session.user.email || '',
            picture: session.user.user_metadata.picture || ''
          });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void initSession();
  }, []);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session });
      setIsAuthenticating(true);

      try {
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              setUser({
                id: session.user.id,
                name: session.user.user_metadata.name || 'Anonymous User',
                email: session.user.email || '',
                picture: session.user.user_metadata.picture || ''
              });
              
              toast({
                title: "Successful Login",
                description: `Welcome, ${session.user.email}`,
              });
              
              navigate('/');
            }
            break;

          case 'SIGNED_OUT':
            setUser(null);
            toast({
              title: "Signed Out",
              description: "You have been successfully signed out",
            });
            navigate('/');
            break;

          case 'TOKEN_REFRESHED':
            console.log('Token refreshed successfully');
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              setUser({
                id: session.user.id,
                name: session.user.user_metadata.name || 'Anonymous User',
                email: session.user.email || '',
                picture: session.user.user_metadata.picture || ''
              });
            }
            break;
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An error occurred while processing authentication state",
        });
      } finally {
        setIsAuthenticating(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const login = async () => {
    try {
      setIsAuthenticating(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message,
        });
      }

      return { data, error };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
      });
      return { data: null, error };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticating(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Logout Error",
          description: error.message,
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: error.message || "An unexpected error occurred",
      });
      return { error };
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticating,
    login,
    logout
  };
};
