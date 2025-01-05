import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserRole {
  userId: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useUserRole = (): UserRole => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
          
          const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('is_verified, is_admin')
            .eq('auth_id', session.user.id)
            .single();
          
          if (userError) {
            throw userError;
          }

          if (userData) {
            setIsVerified(userData.is_verified);
            setIsAdmin(userData.is_admin);
            console.log('User roles:', { isVerified: userData.is_verified, isAdmin: userData.is_admin });
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch user role'));
      } finally {
        setIsLoading(false);
      }
    };

    void getSession();
  }, []);

  return { userId, isVerified, isAdmin, isLoading, error };
};