import { toast } from '@/hooks/use-toast';
import { WalletConnectionResult } from './types';

export const connectToWallet = async (): Promise<WalletConnectionResult> => {
  try {
    // 1. Check if Phantom is installed
    if (!window.solana?.isPhantom) {
      console.log('Phantom wallet not detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Phantom wallet not installed" };
    }

    // 2. Direct connection request
    console.log('Requesting wallet connection...');
    const response = await window.solana.connect();
    const publicKey = response.publicKey.toString();
    
    console.log('Wallet connected successfully:', publicKey);
    toast({
      title: "Success",
      description: "Wallet connected successfully",
    });

    return { success: true, publicKey };
  } catch (error: any) {
    console.error('Wallet connection error:', error);
    
    if (error.message?.includes('User rejected')) {
      toast({
        title: "Connection Cancelled",
        description: "You cancelled the connection request",
        variant: "destructive",
      });
      return { success: false, error: "User rejected connection" };
    }

    toast({
      title: "Connection Failed",
      description: "Failed to connect wallet. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};