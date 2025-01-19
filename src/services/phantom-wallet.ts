import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const NETWORK = 'mainnet-beta';
const ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const connectWallet = async () => {
  try {
    console.log('Starting wallet connection process...');

    // Check if Phantom is installed
    if (!window.solana?.isPhantom) {
      console.log('Phantom wallet not detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Force a new connection request
    console.log('Requesting new wallet connection...');
    const response = await window.solana.connect({ onlyIfTrusted: false });
    const publicKey = response.publicKey.toString();
    
    console.log('Wallet connected successfully:', publicKey);
    toast({
      title: "Success",
      description: "Wallet connected successfully",
    });

    return { success: true, publicKey };
  } catch (error: any) {
    console.error('Wallet connection error:', error);
    
    // Handle user rejection
    if (error.message?.includes('User rejected')) {
      toast({
        title: "Connection Cancelled",
        description: "You cancelled the connection request",
        variant: "destructive",
      });
      return { success: false, error: "User rejected connection" };
    }

    toast({
      title: "Connection Failed",
      description: "Failed to connect wallet. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const sendPayment = async (amount: number, memeId: string) => {
  try {
    console.log('Starting payment process...', { amount, memeId });

    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not installed");
    }

    // Always request a new connection
    console.log('Ensuring wallet connection...');
    const connectionResult = await connectWallet();
    if (!connectionResult.success) {
      throw new Error("Failed to connect wallet");
    }

    const connection = new Connection(ENDPOINT, 'confirmed');
    const fromPubkey = new PublicKey(window.solana.publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Check balance
    console.log('Checking wallet balance...');
    const balance = await connection.getBalance(fromPubkey);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    const minimumRequired = requiredAmount + (0.000005 * LAMPORTS_PER_SOL); // Buffer for gas
    
    if (balance < minimumRequired) {
      throw new Error(`Insufficient balance. Required: ${amount} SOL plus gas fees`);
    }

    // Create transaction
    console.log('Creating transaction...');
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: requiredAmount
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
    console.log('Requesting transaction signature...');
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    console.log('Waiting for transaction confirmation...');
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction confirmed:', signature);
    toast({
      title: "Payment Successful",
      description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
    });

    return { success: true, signature, memeId };
  } catch (error: any) {
    console.error('Payment error:', error);
    
    if (error.message?.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction",
        variant: "destructive",
      });
      return { success: false, error: "User rejected transaction" };
    }

    toast({
      title: "Payment Failed",
      description: error.message || "Transaction failed",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};