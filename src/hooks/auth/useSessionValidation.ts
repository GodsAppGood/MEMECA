import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./types";

export const useSessionValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const { toast } = useToast();

  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was an issue validating your session. Please try logging in again.",
        });
        return null;
      }

      if (!session) {
        console.log('No active session found');
        return null;
      }

      // Attempt to refresh the session if it exists
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Session refresh error:', refreshError);
        toast({
          variant: "destructive",
          title: "Session Error",
          description: "Unable to refresh your session. Please log in again.",
        });
        return null;
      }

      return refreshData.session;
    } catch (error) {
      console.error('Unexpected error during session validation:', error);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateSession,
    isValidating
  };
};