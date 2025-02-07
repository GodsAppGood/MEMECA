
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserRoles = async (userId: string) => {
      try {
        console.log('Проверка ролей пользователя:', userId);
        
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin, email, name, profile_image')
          .eq('auth_id', userId)
          .single();
        
        if (userError) {
          console.error('Ошибка получения данных пользователя:', userError);
          return null;
        }
        
        return userData;
      } catch (error) {
        console.error('Ошибка в handleUserRoles:', error);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        const userData = await handleUserRoles(session.user.id);
        
        if (!userData) {
          console.error('Данные пользователя не найдены после входа');
          await supabase.auth.signOut();
          navigate('/');
          return;
        }

        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          console.error('Ошибка проверки сессии:', sessionError);
          return;
        }

        if (userData.is_admin) {
          navigate('/admin');
        }
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await handleUserRoles(session.user.id);
        }
      } catch (error) {
        console.error('Ошибка при начальной проверке сессии:', error);
      }
    };

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};
