import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const SOLANA_ENDPOINT = "https://api.mainnet-beta.solana.com";

interface WalletResponse {
  success: boolean;
  signature?: string;
  error?: string;
}

export const connectWallet = async (): Promise<WalletResponse> => {
  try {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return { 
        success: false, 
        error: "Please install Phantom wallet" 
      };
    }

    const response = await window.solana.connect();
    return { 
      success: true, 
      signature: response.publicKey.toString() 
    };
  } catch (error: any) {
    console.error('Wallet connection error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const sendPayment = async (
  amount: number,
  memeId: string
): Promise<WalletResponse> => {
  try {
    if (!window.solana?.isPhantom || !window.solana.isConnected) {
      const connection = await connectWallet();
      if (!connection.success) {
        return connection;
      }
    }

    const connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
    const fromPubkey = new PublicKey(window.solana.publicKey!.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Check balance
    const balance = await connection.getBalance(fromPubkey);
    const requiredBalance = amount * LAMPORTS_PER_SOL;
    
    if (balance < requiredBalance) {
      return { 
        success: false, 
        error: `Insufficient balance. Required: ${amount} SOL` 
      };
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: requiredBalance
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    // Record payment in database
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
      console.error('Database error:', dbError);
      return {
        success: false,
        error: 'Payment recorded but failed to update database'
      };
    }

    return { success: true, signature };
  } catch (error: any) {
    console.error('Payment error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};