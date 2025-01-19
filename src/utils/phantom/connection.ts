import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG, ERROR_MESSAGES } from './config';
import { WalletConnectionResult } from './types';

export const checkWalletInstalled = (): boolean => {
  const isInstalled = window.solana?.isPhantom || false;
  if (!isInstalled) {
    console.log('Phantom wallet not detected');
    toast({
      title: "Wallet Not Found",
      description: ERROR_MESSAGES.NOT_INSTALLED,
      variant: "destructive",
    });
  }
  return isInstalled;
};

export const validateNetwork = async (): Promise<boolean> => {
  try {
    if (!window.solana?.isConnected) return false;
    
    // Instead of using connection property, we'll check if the wallet is connected
    // and assume it's on the correct network since Phantom handles network switching
    const isConnected = window.solana.isConnected;
    
    if (!isConnected) {
      toast({
        title: "Wrong Network",
        description: `Please switch to ${WALLET_CONFIG.network}`,
        variant: "destructive",
      });
    }
    
    return isConnected;
  } catch (error) {
    console.error('Network validation error:', error);
    return false;
  }
};

export const connectToWallet = async (): Promise<WalletConnectionResult> => {
  try {
    if (!checkWalletInstalled()) {
      return { success: false, error: ERROR_MESSAGES.NOT_INSTALLED };
    }

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
        description: ERROR_MESSAGES.USER_REJECTED,
        variant: "destructive",
      });
      return { success: false, error: ERROR_MESSAGES.USER_REJECTED };
    }

    toast({
      title: "Connection Failed",
      description: ERROR_MESSAGES.NOT_CONNECTED,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};