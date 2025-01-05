import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhantomWalletButtonProps {
  onSuccess: (response: any) => void;
  onError: () => void;
}

export const PhantomWalletButton = ({ onSuccess, onError }: PhantomWalletButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if Phantom Wallet is installed
      const provider = (window as any).solana;
      if (!provider?.isPhantom) {
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom Wallet to continue",
          variant: "destructive",
        });
        return;
      }

      // Connect to Phantom Wallet
      const response = await provider.connect();
      const walletAddress = response.publicKey.toString();

      // Generate nonce
      const { data: nonceData, error: nonceError } = await supabase.functions.invoke('wallet-auth', {
        body: {
          walletAddress,
          path: '/generate-nonce',
        },
      });

      if (nonceError) {
        console.error('Error generating nonce:', nonceError);
        throw new Error('Failed to generate authentication nonce');
      }

      // Sign the nonce
      const encodedMessage = new TextEncoder().encode(nonceData.nonce);
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8');

      // Verify signature
      const { data: authData, error: verifyError } = await supabase.functions.invoke('wallet-auth', {
        body: {
          walletAddress,
          signature: signedMessage,
          nonce: nonceData.nonce,
          path: '/verify-signature',
        },
      });

      if (verifyError) {
        console.error('Error verifying signature:', verifyError);
        throw new Error('Failed to verify wallet signature');
      }

      toast({
        title: "Success",
        description: "Successfully connected with Phantom Wallet",
      });

      onSuccess(authData);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      onError();
    } finally {
      setIsLoading(false);
    }
  }, [toast, onSuccess, onError]);

  return (
    <Button
      variant="outline"
      onClick={connectWallet}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2"
    >
      {isLoading ? (
        "Connecting..."
      ) : (
        <>
          <img
            src="https://phantom.app/favicon.ico"
            alt="Phantom"
            className="w-4 h-4"
          />
          <span>Connect Phantom Wallet</span>
        </>
      )}
    </Button>
  );
};