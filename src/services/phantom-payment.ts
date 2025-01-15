import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const AMOUNT = 0.1;
const NETWORK = 'mainnet-beta';
const ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const sendSolPayment = async (memeId: string, memeTitle: string) => {
  try {
    console.log('Starting payment process...', { memeId, memeTitle });

    if (!window.solana?.isPhantom) {
      console.error('Phantom wallet not found');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Connect to wallet if not connected
    if (!window.solana.isConnected) {
      try {
        await window.solana.connect();
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        return { success: false, error: "Failed to connect wallet" };
      }
    }

    const connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Create proper PublicKey instances
    const fromPubkey = new PublicKey(window.solana.publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: AMOUNT * LAMPORTS_PER_SOL
      })
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
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
    console.error('Payment error:', error);
    toast({
      title: "Payment Failed",
      description: error.message || "Transaction failed",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};