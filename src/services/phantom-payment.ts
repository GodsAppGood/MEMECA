import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const AMOUNT = 0.1;
const NETWORK = 'mainnet-beta';
const ENDPOINT = 'https://api.mainnet-beta.solana.com';

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

    // Connect to wallet with explicit error handling
    let publicKey;
    try {
      const resp = await window.solana.connect();
      publicKey = resp.publicKey;
      
      console.log('Connected to wallet:', publicKey.toString());
      
      toast({
        title: "Wallet Connected",
        description: "Your Phantom wallet is now connected",
      });
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      toast({
        title: "Connection Failed",
        description: err.message || "Could not connect to Phantom wallet",
        variant: "destructive",
      });
      return { success: false, error: "Failed to connect wallet" };
    }

    // Create connection with better error handling
    const connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Check balance with proper error handling
    try {
      const balance = await connection.getBalance(publicKey);
      console.log('Current balance:', balance / LAMPORTS_PER_SOL, 'SOL');
      
      if (balance < AMOUNT * LAMPORTS_PER_SOL) {
        toast({
          title: "Insufficient Balance",
          description: `You need at least ${AMOUNT} SOL plus gas fees`,
          variant: "destructive",
        });
        return { success: false, error: "Insufficient balance" };
      }
    } catch (err: any) {
      console.error('Failed to get balance:', err);
      toast({
        title: "Balance Check Failed",
        description: "Could not verify wallet balance. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Failed to check balance" };
    }

    // Create and send transaction
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(RECIPIENT_ADDRESS),
          lamports: AMOUNT * LAMPORTS_PER_SOL
        })
      );

      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('Transaction created:', {
        amount: AMOUNT,
        recipient: RECIPIENT_ADDRESS,
        network: NETWORK
      });

      const signed = await window.solana.signTransaction(transaction);
      console.log('Transaction signed, sending...');
      
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log('Transaction sent:', signature);
      
      await connection.confirmTransaction(signature);
      console.log('Transaction confirmed:', signature);

      // Log successful transaction
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("TransactionLogs").insert({
          user_id: user.id,
          meme_id: parseInt(memeId),
          transaction_status: "success",
          transaction_signature: signature,
          amount: AMOUNT,
          wallet_address: publicKey.toString()
        });
      }

      toast({
        title: "Payment Successful",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      });

      return { success: true, signature };
    } catch (err: any) {
      console.error('Transaction failed:', err);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("TransactionLogs").insert({
          user_id: user.id,
          meme_id: parseInt(memeId),
          transaction_status: "failed",
          error_message: err.message,
          amount: AMOUNT,
          wallet_address: publicKey?.toString()
        });
      }

      toast({
        title: "Transaction Failed",
        description: err.message,
        variant: "destructive",
      });

      return { success: false, error: err.message };
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);
    toast({
      title: "Payment Failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};