import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const AMOUNT = 0.1;
const NETWORK = 'mainnet-beta';
const ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const sendSolPayment = async (memeId: string, memeTitle: string) => {
  try {
    console.log('Initiating SOL payment process...', { memeId, memeTitle });
    
    if (!window.solana || !window.solana.isPhantom) {
      console.error('Phantom wallet not found');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom Wallet to proceed",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Phantom wallet not installed" };
    }

    let publicKey;
    try {
      const resp = await window.solana.connect();
      publicKey = resp.publicKey;
      console.log('Connected to wallet:', publicKey.toString());
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      toast({
        title: "Connection Failed",
        description: err.message || "Could not connect to Phantom wallet",
        variant: "destructive",
      });
      return { success: false, error: "Failed to connect wallet" };
    }

    const connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

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

    console.log('Requesting signature...');
    const signed = await window.solana.signTransaction(transaction);
    
    console.log('Sending transaction...');
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    console.log('Confirming transaction...');
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction confirmed:', signature);

    toast({
      title: "Payment Successful",
      description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature };
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