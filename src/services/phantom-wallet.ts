import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logWalletAction, logWalletError } from '@/utils/phantom/logger';
import { WALLET_CONFIG, ERROR_MESSAGES } from '@/utils/phantom/config';

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const SOLANA_ENDPOINT = "https://api.mainnet-beta.solana.com";

interface TransactionConfirmation {
  value: {
    err: string | null;
  };
}

export const connectWallet = async () => {
  try {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: ERROR_MESSAGES.NOT_INSTALLED };
    }

    logWalletAction('Connecting wallet', { timestamp: new Date() });
    const response = await window.solana.connect();
    logWalletAction('Wallet connected', { publicKey: response.publicKey.toString() });
    
    return { success: true, publicKey: response.publicKey.toString() };
  } catch (error: any) {
    logWalletError('Connection error', error);
    return { success: false, error: error.message };
  }
};

export const sendPayment = async (amount: number, memeId: string) => {
  try {
    if (!window.solana?.isPhantom) {
      toast({
        title: "Wallet Not Found",
        description: ERROR_MESSAGES.NOT_INSTALLED,
        variant: "destructive",
      });
      return { success: false, error: ERROR_MESSAGES.NOT_INSTALLED };
    }

    // Connect wallet if not connected
    if (!window.solana.isConnected) {
      const connectionResult = await window.solana.connect();
      if (!connectionResult) {
        throw new Error(ERROR_MESSAGES.NOT_CONNECTED);
      }
    }

    const connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
    const fromPubkey = new PublicKey(window.solana.publicKey!.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Check balance with some buffer for fees
    const balance = await connection.getBalance(fromPubkey);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    const minimumRequired = requiredAmount + (0.01 * LAMPORTS_PER_SOL); // Add buffer for fees
    
    if (balance < minimumRequired) {
      const errorMessage = `Insufficient balance. Required: ${amount + 0.01} SOL`;
      toast({
        title: "Insufficient Balance",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }

    logWalletAction('Creating transaction', { amount, memeId });

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: requiredAmount
      })
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    logWalletAction('Transaction sent', { signature });

    // Wait for confirmation with timeout
    const confirmation = await Promise.race([
      connection.confirmTransaction(signature) as Promise<TransactionConfirmation>,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
      )
    ]);

    if ('value' in confirmation && confirmation.value.err) {
      throw new Error('Transaction failed to confirm');
    }

    // Record in database
    const { error: dbError } = await supabase
      .from('TuzemoonPayments')
      .insert({
        meme_id: parseInt(memeId),
        user_id: (await supabase.auth.getUser()).data.user?.id,
        transaction_signature: signature,
        amount: amount,
        transaction_status: 'success',
        wallet_address: fromPubkey.toString()
      });

    if (dbError) {
      logWalletError('Database error', dbError);
      console.error('Database error:', dbError);
    }

    toast({
      title: "Payment Successful",
      description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature };
  } catch (error: any) {
    logWalletError('Payment error', error);
    
    const errorMessage = error.message.includes('User rejected') 
      ? 'Transaction cancelled by user'
      : error.message || "Transaction failed";
    
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { success: false, error: errorMessage };
  }
};