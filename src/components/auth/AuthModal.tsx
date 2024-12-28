import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailAuthForm } from "./EmailAuthForm";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { Link } from "react-router-dom";
import { useMagicLink } from "@/hooks/auth/useMagicLink";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (response: any) => void;
  onLoginError: () => void;
}

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, onLoginError }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { sendMagicLink, isLoading: isMagicLinkLoading } = useMagicLink();
  const { toast } = useToast();

  const handleMagicLinkSuccess = async (email: string) => {
    try {
      await sendMagicLink(email);
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
      onClose();
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send magic link",
      });
      onLoginError();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to MemeCatlandar</DialogTitle>
          <DialogDescription>
            Choose your preferred way to authenticate. By continuing, you agree to our{" "}
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

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <EmailAuthForm 
                  mode="signin" 
                  onSuccess={handleMagicLinkSuccess}
                  onError={onLoginError}
                  isLoading={isMagicLinkLoading}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <EmailAuthForm 
                  mode="signup" 
                  onSuccess={handleMagicLinkSuccess}
                  onError={onLoginError}
                  isLoading={isMagicLinkLoading}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="google">
            <div className="flex justify-center p-4">
              <GoogleAuthButton onSuccess={onLoginSuccess} onError={onLoginError} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};