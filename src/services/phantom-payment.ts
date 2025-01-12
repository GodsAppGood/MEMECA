import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;
const RECIPIENT_WALLET = process.env.VITE_TUZEMOON_WALLET_ADDRESS || "YOUR_RECIPIENT_WALLET_ADDRESS";

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string,
  amount: number = 0.1
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    console.log('Starting payment process...', {
      memeId,
      memeTitle,
      amount,
      timestamp: new Date().toISOString()
    });

    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    // Ensure wallet is connected
    if (!window.solana.publicKey) {
      await window.solana.connect();
    }

    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Get the sender's public key directly from Phantom and create a PublicKey instance
    const senderPublicKeyStr = window.solana.publicKey?.toString();
    if (!senderPublicKeyStr) {
      throw new Error("Failed to get wallet public key");
    }
    const sender = new PublicKey(senderPublicKeyStr);

    // Create recipient public key from address string
    let recipient: PublicKey;
    try {
      recipient = new PublicKey(RECIPIENT_WALLET);
    } catch (error) {
      console.error('Invalid recipient address:', error);
      throw new Error("Invalid recipient wallet address");
    }

    // Check balance
    const balance = await connection.getBalance(sender);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    
    if (balance < requiredAmount) {
      throw new Error(`Insufficient balance. Required: ${amount} SOL`);
    }

    console.log('Creating transaction:', {
      sender: sender.toString(),
      recipient: recipient.toString(),
      amount: requiredAmount,
    });

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

    console.log('Requesting signature from Phantom...');
    
    // Request signature from user
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    console.log('Transaction signed, sending to network...');
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    console.log('Waiting for confirmation...');
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction confirmed:', signature);

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
    console.error('Payment error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
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