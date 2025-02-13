
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionManager } from '@/utils/auth/sessionManager';

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
  const sessionManager = SessionManager.getInstance();

  const initializeAuth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  const login = async () => {
    try {
      setIsAuthenticating(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: '*'
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
        return { data: null, error };
      }

      return { data, error: null };
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

      setUser(null);
      navigate('/');
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
