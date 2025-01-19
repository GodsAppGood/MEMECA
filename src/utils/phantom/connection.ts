import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG } from './config';
import { logWalletAction, logWalletError } from './logger';
import { WalletConnectionResult } from './types';
import { Connection, PublicKey } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkWalletInstalled = (): boolean => {
  const isInstalled = window.solana && window.solana.isPhantom;
  if (!isInstalled) {
    toast({
      title: "Wallet Not Found",
      description: "Please install Phantom wallet to continue",
      variant: "destructive",
    });
    window.open('https://phantom.app/', '_blank');
  }
  return isInstalled;
};

export const connectToWallet = async (): Promise<WalletConnectionResult> => {
  try {
    if (!checkWalletInstalled()) {
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Request connection
    console.log('Requesting wallet connection...');
    const response = await window.solana.connect({ onlyIfTrusted: false });
    const publicKey = response.publicKey.toString();
    
    // Verify connection with edge function
    console.log('Verifying wallet connection with backend...');
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke('wallet-auth', {
      body: { 
        action: 'connect',
        publicKey 
      }
    });

    if (verifyError) {
      console.error('Wallet verification failed:', verifyError);
      throw new Error('Failed to verify wallet connection');
    }

    console.log('Wallet connected and verified:', publicKey);
    toast({
      title: "Success",
      description: "Wallet connected successfully",
    });

    return { success: true, publicKey };
  } catch (error: any) {
    logWalletError('Connection', error);
    
    if (error.message?.includes('User rejected')) {
      toast({
        title: "Connection Cancelled",
        description: "You declined the connection request",
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