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
      console.log('Wallet connected successfully:', resp.publicKey.toString());
      return resp.publicKey.toString();
    } catch (err: any) {
      if (err.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        });
      }
      console.error('Wallet connection error:', err);
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
    console.log('Attempting to sign message:', message);
    
    const encodedMessage = new TextEncoder().encode(message);
    console.log('Encoded message length:', encodedMessage.length);
    
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      "utf8"
    );
    
    console.log('Message signed successfully:', {
      signatureLength: signedMessage.length,
      signature: Array.from(signedMessage).toString()
    });
    
    return signedMessage;
  } catch (error: any) {
    if (error.code === 4001) {
      console.log('User rejected message signing');
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