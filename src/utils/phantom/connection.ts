import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG, ERROR_MESSAGES } from './config';
import { logWalletAction, logWalletError } from './logger';
import { WalletConnectionResult } from './types';
import { Connection } from '@solana/web3.js';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkWalletInstalled = (): boolean => {
  const isInstalled = window.solana && window.solana.isPhantom;
  if (!isInstalled) {
    toast({
      title: "Wallet Not Found",
      description: ERROR_MESSAGES.NOT_INSTALLED,
      variant: "destructive",
    });
    window.open('https://phantom.app/', '_blank');
  }
  return isInstalled;
};

export const validateNetwork = async (connection: Connection): Promise<boolean> => {
  try {
    const genesisHash = await connection.getGenesisHash();
    logWalletAction('Network validation', { 
      network: WALLET_CONFIG.network,
      genesisHash 
    });
    return true;
  } catch (error) {
    logWalletError('Network validation', error);
    return false;
  }
};

export const connectToWallet = async (retryCount = 0): Promise<WalletConnectionResult> => {
  try {
    if (!checkWalletInstalled()) {
      return { success: false, error: ERROR_MESSAGES.NOT_INSTALLED };
    }

    const response = await window.solana.connect();
    const publicKey = response.publicKey.toString();
    
    logWalletAction('Connected', { publicKey });
    
    const connection = new Connection(WALLET_CONFIG.endpoint);
    const isValidNetwork = await validateNetwork(connection);
    
    if (!isValidNetwork) {
      toast({
        title: "Network Error",
        description: ERROR_MESSAGES.INVALID_NETWORK,
        variant: "destructive",
      });
      return { success: false, error: ERROR_MESSAGES.INVALID_NETWORK };
    }

    return { success: true, publicKey };
  } catch (error: any) {
    logWalletError('Connection', error);
    
    if (retryCount < WALLET_CONFIG.maxRetries) {
      await sleep(WALLET_CONFIG.retryDelay);
      return connectToWallet(retryCount + 1);
    }

    const errorMessage = error.message === 'User rejected the request.' 
      ? "You declined the connection request. Please try again."
      : ERROR_MESSAGES.NOT_CONNECTED;
    
    toast({
      title: "Connection Error",
      description: errorMessage,
      variant: "destructive",
    });

    return { success: false, error: errorMessage };
  }
};