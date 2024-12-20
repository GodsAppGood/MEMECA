import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

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
  return (
    <>
      <Button
        variant="default"
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] active:bg-[#6E59A5] transition-colors"
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
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              locale="en"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};