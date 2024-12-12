import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!currentSession) {
          toast({
            title: "Authentication Required",
            description: "Please log in to submit memes.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        console.log("Current session:", currentSession);
        setSession(currentSession);

        await ensureUserExists(currentSession);
      } catch (error: any) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Please try logging in again.",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    const ensureUserExists = async (currentSession: any) => {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('*')
        .eq('auth_id', currentSession.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (!userData) {
        const { error: insertError } = await supabase
          .from('Users')
          .insert([{
            auth_id: currentSession.user.id,
            email: currentSession.user.email,
            name: currentSession.user.user_metadata?.name,
            profile_image: currentSession.user.user_metadata?.picture
          }]);

        if (insertError) throw insertError;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return { session, isLoading };
};