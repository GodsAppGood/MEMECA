import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginButtonProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLoginSuccess: (response: any) => void;
  handleLoginError: () => void;
}

export const LoginButton = ({
  isLoginOpen,
  setIsLoginOpen,
  handleLoginSuccess,
  handleLoginError,
}: LoginButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async (response: any) => {
    setIsLoading(true);
    console.log('Google OAuth login attempt:', {
      timestamp: new Date().toISOString(),
      responseType: typeof response,
      hasCredential: !!response?.credential,
      origin: window.location.origin,
      environment: import.meta.env.MODE,
      currentPath: window.location.pathname,
      redirectUri: `${window.location.origin}/auth/v1/callback`,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
    });

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/v1/callback`
        }
      });

      if (error) {
        console.error('Supabase OAuth error:', error);
        toast({
          variant: "destructive",
          title: "Login Error",
          description: "Failed to authenticate with Google. Please try again.",
        });
        handleLoginError();
        return;
      }

      console.log('Supabase OAuth success:', data);
      handleLoginSuccess(response);
    } catch (error) {
      console.error('Login error:', error);
      handleLoginError();
    } finally {
      setIsLoading(false);
      setIsLoginOpen(false);
    }
  };

  const onError = () => {
    setIsLoading(false);
    console.error('Google OAuth login failed:', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      origin: window.location.origin,
      environment: import.meta.env.MODE,
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/v1/callback`,
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      hasLocalStorage: !!window.localStorage
    });

    toast({
      variant: "destructive",
      title: "Login Error",
      description: "There was a problem logging in with Google. Please make sure pop-ups and cookies are enabled, then try again.",
    });
    handleLoginError();
  };

  return (
    <>
      <Button
        variant="default"
        className="bg-[#FFB74D] text-black hover:bg-[#EAA347] transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        onClick={() => setIsLoginOpen(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login with Google</DialogTitle>
            <DialogDescription>
              We use secure Google authentication to protect your data. By logging in, you agree to our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Use
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
                locale="en"
                context="signin"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};