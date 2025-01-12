import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Constants
const RECIPIENT_ADDRESS = "3ni66gLWZjSppB6vBSZxAMpJWV6PqLypznECKD5wFHhD";
const AMOUNT = 0.1;
const NETWORK = 'devnet';
const ENDPOINT = `https://api.${NETWORK}.solana.com`;

export const sendSolPayment = async (memeId: string, memeTitle: string) => {
  try {
    // Check if Phantom is installed
    if (!window.solana || !window.solana.isPhantom) {
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom Wallet to proceed",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Log transaction attempt
    const user = await supabase.auth.getUser();
    await supabase.from("TransactionLogs").insert({
      user_id: user.data.user?.id,
      meme_id: parseInt(memeId),
      transaction_status: "pending",
      amount: AMOUNT,
      wallet_address: RECIPIENT_ADDRESS
    });

    // Connect to wallet
    let publicKey;
    try {
      const resp = await window.solana.connect();
      publicKey = resp.publicKey;
      
      toast({
        title: "Wallet Connected",
        description: "Your Phantom wallet is now connected",
      });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Phantom wallet",
        variant: "destructive",
      });
      return { success: false, error: "Failed to connect wallet" };
    }

    // Create connection to Solana
    const connection = new Connection(ENDPOINT);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(RECIPIENT_ADDRESS),
        lamports: AMOUNT * LAMPORTS_PER_SOL
      })
    );

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Request signature from user
    try {
      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      // Log successful transaction
      await supabase.from("TransactionLogs").update({
        transaction_status: "completed",
        transaction_signature: signature
      }).eq('user_id', user.data.user?.id)
        .eq('meme_id', parseInt(memeId))
        .eq('transaction_status', 'pending');

      toast({
        title: "Payment Successful",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      });

      return { success: true, signature };
    } catch (err: any) {
      console.error('Transaction failed:', err);
      
      // Log failed transaction
      await supabase.from("TransactionLogs").update({
        transaction_status: "failed",
        error_message: err.message
      }).eq('user_id', user.data.user?.id)
        .eq('meme_id', parseInt(memeId))
        .eq('transaction_status', 'pending');

      toast({
        title: "Transaction Failed",
        description: err.message,
        variant: "destructive",
      });

      return { success: false, error: err.message };
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);

    // Log failed transaction
    const user = await supabase.auth.getUser();
    await supabase.from("TransactionLogs").insert({
      user_id: user.data.user?.id,
      meme_id: parseInt(memeId),
      transaction_status: "failed",
      amount: AMOUNT,
      error_message: error.message,
      wallet_address: RECIPIENT_ADDRESS
    });

    toast({
      title: "Payment Failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });

    return { success: false, error: error.message };
  }
};