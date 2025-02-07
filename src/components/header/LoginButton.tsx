
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

interface LoginButtonProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
}

export const LoginButton = ({
  isLoginOpen,
  setIsLoginOpen,
}: LoginButtonProps) => {
  const { login, isAuthenticating } = useAuthSession();

  const handleLogin = async () => {
    const { error } = await login();
    if (error) {
      setIsLoginOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="bg-[#FFB74D] text-black hover:bg-[#EAA347] transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        onClick={() => setIsLoginOpen(true)}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md border-[#FFB74D]">
          <DialogHeader>
            <DialogTitle>Sign in with Google</DialogTitle>
            <DialogDescription>
              We use secure authentication to protect your data. By logging in, you agree to our{" "}
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
            {isAuthenticating ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Connecting...</span>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="w-full bg-[#FFB74D] hover:bg-[#EAA347] text-black transition-all duration-300"
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

