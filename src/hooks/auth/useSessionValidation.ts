import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export const useSessionValidation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to validate your session. Please try logging in again.",
        });
        return null;
      }

      if (!session) {
        setIsLoading(false);
        return null;
      }

      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError);
        return null;
      }

      return {
        id: String(userData?.id || session.user.id),
        auth_id: session.user.id,
        name: userData?.name || session.user.user_metadata.name || session.user.email,
        email: userData?.email || session.user.email,
        picture: userData?.profile_image || session.user.user_metadata.picture,
        profile_image: userData?.profile_image || session.user.user_metadata.picture,
        isAdmin: userData?.is_admin || false,
        is_admin: userData?.is_admin || false,
        email_confirmed: userData?.email_confirmed || false,
        is_verified: userData?.is_verified || false,
        created_at: userData?.created_at
      };
    } catch (error) {
      console.error('Unexpected session validation error:', error);
      return null;
    }
  };

  return { validateSession, isLoading, setIsLoading, user, setUser };
};