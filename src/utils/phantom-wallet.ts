import { toast } from "@/hooks/use-toast";

export const connectPhantomWallet = async () => {
  toast({
    title: "Feature Unavailable",
    description: "Wallet connection is temporarily disabled",
    variant: "destructive",
  });
  return null;
};

export const signMessage = async (message: string) => {
  toast({
    title: "Feature Unavailable",
    description: "Message signing is temporarily disabled",
    variant: "destructive",
  });
  return null;
};