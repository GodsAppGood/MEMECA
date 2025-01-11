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
      console.log('Wallet connected successfully:', {
        publicKey: resp.publicKey.toString(),
        timestamp: new Date().toISOString(),
        isPhantom: window.solana.isPhantom,
        isConnected: window.solana.isConnected
      });
      return resp.publicKey.toString();
    } catch (err: any) {
      if (err.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        });
      }
      console.error('Wallet connection error:', {
        error: err,
        code: err.code,
        message: err.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  } catch (error) {
    console.error("Error connecting to Phantom wallet:", {
      error,
      timestamp: new Date().toISOString(),
      solanaExists: !!window.solana,
      isPhantom: window?.solana?.isPhantom
    });
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
    console.log('Preparing to sign message:', {
      messageLength: message.length,
      message,
      timestamp: new Date().toISOString()
    });
    
    const encodedMessage = new TextEncoder().encode(message);
    console.log('Encoded message:', {
      encodedLength: encodedMessage.length,
      encodedBytes: Array.from(encodedMessage),
      timestamp: new Date().toISOString()
    });
    
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      "utf8"
    );
    
    console.log('Message signed successfully:', {
      signatureLength: signedMessage.signature.length,
      signatureBytes: Array.from(signedMessage.signature),
      timestamp: new Date().toISOString()
    });
    
    return signedMessage.signature;
  } catch (error: any) {
    if (error.code === 4001) {
      console.log('User rejected message signing');
      toast({
        title: "Signature Canceled",
        description: "Transaction canceled by user",
        variant: "destructive",
      });
    } else {
      console.error("Error signing message:", {
        error,
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Signature Error",
        description: "Failed to sign the message",
        variant: "destructive",
      });
    }
    return null;
  }
};