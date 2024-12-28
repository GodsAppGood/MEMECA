import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { useSessionValidation } from "./useSessionValidation";

export const useAuthState = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateSession, isLoading, setIsLoading, setUser: setValidatedUser } = useSessionValidation();

  useEffect(() => {
    const initializeAuth = async () => {
      const validatedUser = await validateSession();
      setValidatedUser(validatedUser);
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (session?.user) {
        const validatedUser = await validateSession();
        setValidatedUser(validatedUser);

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
  }, [navigate, toast, validateSession, setIsLoading, setValidatedUser]);

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