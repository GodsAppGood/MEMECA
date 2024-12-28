import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log('Checking session status...');
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
          console.log('Active session found:', {
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          });
          
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name || 'Anonymous User',
            email: session.user.email || '',
            picture: session.user.user_metadata.picture || ''
          });
        } else {
          console.log('No active session found');
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
        console.log('User signed in:', {
          id: session.user.id,
          email: session.user.email,
          metadata: session.user.user_metadata
        });
        
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || 'Anonymous User',
          email: session.user.email || '',
          picture: session.user.user_metadata.picture || ''
        });
        
        toast({
          title: "Welcome back!",
          description: `Signed in as ${session.user.email}`,
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        navigate('/');
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { user, isLoading };
};