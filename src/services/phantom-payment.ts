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
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Please install Phantom wallet" };
    }

    // Connect to wallet
    try {
      if (!window.solana.isConnected) {
        const resp = await window.solana.connect();
        console.log('Connected to wallet:', resp.publicKey.toString());
      }
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      return { success: false, error: "Failed to connect wallet" };
    }

    const connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Check balance
    const balance = await connection.getBalance(window.solana.publicKey);
    console.log('Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    if (balance < AMOUNT * LAMPORTS_PER_SOL) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${AMOUNT} SOL plus gas fees`,
        variant: "destructive",
      });
      return { success: false, error: "Insufficient balance" };
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: new PublicKey(RECIPIENT_ADDRESS),
        lamports: AMOUNT * LAMPORTS_PER_SOL
      })
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = window.solana.publicKey;

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