import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      return { success: false, error: "Phantom wallet not installed" };
    }

    console.log('Connecting to Phantom wallet...');
    const response = await window.solana.connect();
    console.log('Wallet connected:', response.publicKey.toString());
    
    return { success: true, publicKey: response.publicKey.toString() };
  } catch (error: any) {
    console.error('Connection error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPayment = async (amount: number, memeId: string) => {
  try {
    if (!window.solana?.isPhantom) {
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Connect wallet if not connected
    if (!window.solana.isConnected) {
      const connectionResult = await window.solana.connect();
      if (!connectionResult) {
        throw new Error("Failed to connect wallet");
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

    console.log('Creating transaction...');

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
    
    console.log('Transaction sent:', signature);

    // Wait for confirmation with timeout
    const confirmation = await Promise.race([
      connection.confirmTransaction(signature) as Promise<TransactionConfirmation>,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
      ) as Promise<never>
    ]) as TransactionConfirmation;

    if (confirmation.value.err) {
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
      console.error('Database error:', dbError);
    }

    toast({
      title: "Payment Successful",
      description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature };
  } catch (error: any) {
    console.error('Payment error:', error);
    
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