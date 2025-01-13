import { Connection, Transaction } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG, ERROR_MESSAGES } from './config';
import { logWalletAction, logWalletError } from './logger';
import { TransactionResult } from './types';
import { checkWalletInstalled, validateNetwork } from './connection';

export const signAndSendTransaction = async (
  transaction: Transaction,
  retryCount = 0
): Promise<TransactionResult> => {
  try {
    if (!checkWalletInstalled()) {
      return { success: false, error: ERROR_MESSAGES.NOT_INSTALLED };
    }

    toast({
      title: "Action Required",
      description: "Please sign the transaction in your Phantom wallet",
    });

    const signedTransaction = await window.solana.signTransaction(transaction);
    const connection = new Connection(WALLET_CONFIG.endpoint);
    
    logWalletAction('Sending transaction', {
      network: WALLET_CONFIG.network,
      retryCount
    });
    
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
    }

    logWalletAction('Transaction confirmed', { signature });

    toast({
      title: "Success",
      description: `Transaction completed! ID: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature };
  } catch (error: any) {
    logWalletError('Transaction', error, { retryCount });
    
    if (error.message.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction. Try again when ready.",
        variant: "destructive",
      });
      return { success: false, error: "Transaction cancelled" };
    }

    if (retryCount < WALLET_CONFIG.maxRetries) {
      toast({
        title: "Retrying Transaction",
        description: `Attempt ${retryCount + 1} of ${WALLET_CONFIG.maxRetries}...`,
      });
      await new Promise(resolve => setTimeout(resolve, WALLET_CONFIG.retryDelay));
      return signAndSendTransaction(transaction, retryCount + 1);
    }

    toast({
      title: "Transaction Failed",
      description: `Error: ${error.message}. Please try again later.`,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};