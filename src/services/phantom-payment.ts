import { supabase } from "@/integrations/supabase/client";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;
const RECIPIENT_WALLET = process.env.VITE_TUZEMOON_WALLET_ADDRESS || "YOUR_RECIPIENT_WALLET_ADDRESS";

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string,
  amount: number = 0.1
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Get the sender's public key
    const sender = new PublicKey(window.solana.publicKey.toString());
    const recipient = new PublicKey(RECIPIENT_WALLET);

    // Check balance
    const balance = await connection.getBalance(sender);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    
    if (balance < requiredAmount) {
      throw new Error(`Insufficient balance. Required: ${amount} SOL`);
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: requiredAmount,
      })
    );

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;

    // Sign transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    // Log successful transaction
    const { error: logError } = await supabase
      .from('TransactionLogs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        meme_id: parseInt(memeId),
        transaction_status: 'completed',
        amount: amount,
        transaction_signature: signature,
        wallet_address: sender.toString(),
      });

    if (logError) {
      console.error('Error logging transaction:', logError);
    }

    return { 
      success: true, 
      signature 
    };
  } catch (error: any) {
    console.error('Payment error:', error);
    
    // Log failed transaction
    const { error: logError } = await supabase
      .from('TransactionLogs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        meme_id: parseInt(memeId),
        transaction_status: 'failed',
        error_message: error.message,
        wallet_address: window.solana?.publicKey?.toString(),
      });

    if (logError) {
      console.error('Error logging failed transaction:', logError);
    }

    return { 
      success: false, 
      error: error.message 
    };
  }
};