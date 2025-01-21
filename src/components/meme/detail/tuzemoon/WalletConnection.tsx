import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { phantomWallet } from "@/services/phantom-wallet";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    if (!phantomWallet.isPhantomInstalled) {
      toast({
        title: "Phantom Wallet Required",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const publicKey = await phantomWallet.connect();
      if (publicKey) {
        onConnect(true);
        toast({
          title: "Wallet Connected",
          description: `Ready to process payment of 0.1 SOL`,
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      onConnect(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Phantom wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleConnectWallet} 
      className="w-full"
      variant="outline"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Phantom Wallet
    </Button>
  );
};