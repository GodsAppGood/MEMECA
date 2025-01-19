import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG } from './config';
import { logWalletAction, logWalletError } from './logger';
import { WalletConnectionResult } from './types';
import { Connection, PublicKey } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const validateNetwork = async (): Promise<boolean> => {
  try {
    if (!window.solana?.isPhantom) {
      return false;
    }

    const connection = new Connection(WALLET_CONFIG.endpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: WALLET_CONFIG.confirmationTimeout
    });
    
    // Log connection attempt
    console.log('Validating Solana network connection:', {
      network: WALLET_CONFIG.network,
      endpoint: WALLET_CONFIG.endpoint,
      timestamp: new Date().toISOString()
    });

    const version = await connection.getVersion();
    console.log('Connected to Solana network:', {
      version,
      network: WALLET_CONFIG.network,
      feature_set: version?.['feature-set']
    });

    return true;
  } catch (error) {
    console.error('Network validation error:', {
      error,
      endpoint: WALLET_CONFIG.endpoint,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

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

    // Validate network before proceeding
    const isValidNetwork = await validateNetwork();
    if (!isValidNetwork) {
      toast({
        title: "Network Error",
        description: `Please switch to ${WALLET_CONFIG.network} network in your Phantom wallet`,
        variant: "destructive",
      });
      return { success: false, error: "Invalid network" };
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