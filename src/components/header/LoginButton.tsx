import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  const onSuccess = (response: any) => {
    console.log('Google OAuth login successful', {
      timestamp: new Date().toISOString(),
      responseType: typeof response,
      hasCredential: !!response?.credential,
      origin: window.location.origin
    });

    // Log performance metrics
    const timing = performance.now();
    console.log('Login Performance:', {
      executionTime: `${timing}ms`,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    handleLoginSuccess(response);
  };

  const onError = () => {
    console.error('Google OAuth login failed', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      origin: window.location.origin,
      environment: import.meta.env.MODE,
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/v1/callback`
    });

    toast({
      variant: "destructive",
      title: "Login Failed",
      description: "There was a problem signing in with Google. Please try again.",
    });
    handleLoginError();
  };

  return (
    <>
      <Button
        variant="default"
        className="bg-[#FFB74D] text-black hover:bg-[#EAA347] transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        onClick={() => setIsLoginOpen(true)}
      >
        Log in
      </Button>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login with Google</DialogTitle>
            <DialogDescription>
              We use Google's secure authentication to protect your data. By logging in, you agree to our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};