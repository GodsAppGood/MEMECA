import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GoogleAuthButtonProps {
  onSuccess: (response: any) => void;
  onError: () => void;
}

export const GoogleAuthButton = ({ onSuccess, onError }: GoogleAuthButtonProps) => {
  const { toast } = useToast();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
      onSuccess(data);
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Failed to sign in with Google",
      });
      onError();
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Failed to sign in with Google",
        });
        onError();
      }}
      useOneTap
      theme="filled_black"
      shape="pill"
      size="large"
      text="continue_with"
      locale="en"
    />
  );
};