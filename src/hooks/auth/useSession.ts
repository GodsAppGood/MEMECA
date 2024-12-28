import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./types";
import { useSessionValidation } from "./useSessionValidation";
import { useUserData } from "./useUserData";

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateSession, isValidating } = useSessionValidation();
  const { fetchUserData } = useUserData();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await validateSession();
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        if (userData) {
          setUser(userData);
          toast({
            title: "Welcome!",
            description: `Successfully logged in as ${userData.name}!`,
          });
          navigate('/my-memes');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

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
        description: error.message || "Failed to log out",
      });
    }
  };

  return { 
    user, 
    isLoading: isLoading || isValidating, 
    handleLogout 
  };
};