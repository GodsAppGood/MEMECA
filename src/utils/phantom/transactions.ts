import { Connection, Transaction } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';
import { WALLET_CONFIG, ERROR_MESSAGES } from './config';
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

    if (!await validateNetwork()) {
      return { success: false, error: ERROR_MESSAGES.NOT_CONNECTED };
    }

    toast({
      title: "Action Required",
      description: "Please sign the transaction in your Phantom wallet",
    });

    const signedTransaction = await window.solana.signTransaction(transaction);
    const connection = new Connection(WALLET_CONFIG.endpoint);
    
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(ERROR_MESSAGES.TRANSACTION_FAILED);
    }

    toast({
      title: "Success",
      description: `Transaction completed! ID: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature };
  } catch (error: any) {
    console.error('Transaction error:', error);
    
    if (error.message.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: ERROR_MESSAGES.USER_REJECTED,
        variant: "destructive",
      });
      return { success: false, error: ERROR_MESSAGES.USER_REJECTED };
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
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};