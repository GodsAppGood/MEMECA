import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useHeaderAuth = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "There was a problem checking your session. Please try logging in again.",
          });
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
        console.error('Session check error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name || 'Anonymous User',
            email: session.user.email || '',
            picture: session.user.user_metadata.picture || ''
          });

          const { error: upsertError } = await supabase
            .from('Users')
            .upsert({
              auth_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name,
              profile_image: session.user.user_metadata.picture,
              is_verified: true
            }, {
              onConflict: 'auth_id'
            });

          if (upsertError) {
            console.error('Error updating user data:', upsertError);
            throw upsertError;
          }

          toast({
            title: "Successfully logged in",
            description: `Welcome ${session.user.user_metadata.name || 'back'}!`,
          });

          navigate('/my-memes');
        } catch (error: any) {
          console.error('Login error:', error);
          toast({
            variant: "destructive",
            title: "Login Error",
            description: error.message || "There was a problem logging you in.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLoginSuccess = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
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
          title: "Login failed",
          description: error.message,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
      });
    }
    
    setIsLoginOpen(false);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
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
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        return;
      }

      setUser(null);
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
        description: error.message || "An unexpected error occurred",
      });
    }
  };

  return {
    user,
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
    isLoading
  };
};