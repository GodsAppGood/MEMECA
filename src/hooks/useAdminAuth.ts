import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, redirecting to login');
          navigate('/');
          return;
        }

        const { data: userData, error } = await supabase
          .from('Users')
          .select('is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          throw error;
        }

        console.log('Admin status check:', {
          userId: session.user.id,
          isAdmin: userData?.is_admin
        });

        setIsAdmin(userData?.is_admin || false);

        if (!userData?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Admin auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  return { isAdmin, isLoading };
};