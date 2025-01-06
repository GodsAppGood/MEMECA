import { toast } from "@/hooks/use-toast";

export const connectPhantomWallet = async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom Wallet to continue",
        variant: "destructive",
      });
      return null;
    }

    try {
      const resp = await window.solana.connect();
      return resp.publicKey.toString();
    } catch (err: any) {
      if (err.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        });
      }
      return null;
    }
  } catch (error) {
    console.error("Error connecting to Phantom wallet:", error);
    toast({
      title: "Connection Error",
      description: "Failed to connect to Phantom wallet",
      variant: "destructive",
    });
    return null;
  }
};

export const signMessage = async (message: string) => {
  try {
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      "utf8"
    );
    return signedMessage;
  } catch (error: any) {
    if (error.code === 4001) {
      toast({
        title: "Signature Canceled",
        description: "Transaction canceled by user",
        variant: "destructive",
      });
    } else {
      console.error("Error signing message:", error);
      toast({
        title: "Signature Error",
        description: "Failed to sign the message",
        variant: "destructive",
      });
    }
    return null;
  }
};