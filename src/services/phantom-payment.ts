import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const AMOUNT = 0.1;
const NETWORK = 'mainnet-beta';
const ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const sendSolPayment = async (memeId: string, memeTitle: string) => {
  try {
    console.log('Starting payment process...', { memeId, memeTitle });

    // Check if Phantom is installed
    if (!window.solana?.isPhantom) {
      console.error('Phantom wallet not found');
      window.open('https://phantom.app/', '_blank');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Show payment confirmation toast
    toast({
      title: "Payment Required",
      description: "Please confirm the payment in your Phantom wallet",
    });

    // Connect to wallet if not connected
    if (!window.solana.isConnected) {
      try {
        const resp = await window.solana.connect();
        console.log('Connected to Phantom wallet:', resp);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        toast({
          title: "Connection Failed",
          description: "Could not connect to Phantom wallet. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Failed to connect wallet" };
      }
    }

    // Create connection
    const connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Get wallet public key
    if (!window.solana.publicKey) {
      toast({
        title: "Wallet Error",
        description: "Could not get wallet public key. Please reconnect your wallet.",
        variant: "destructive",
      });
      return { success: false, error: "No public key available" };
    }

    // Create proper PublicKey instances
    const fromPubkey = new PublicKey(window.solana.publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Check balance
    try {
      const balance = await connection.getBalance(fromPubkey);
      console.log('Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
      
      if (balance < AMOUNT * LAMPORTS_PER_SOL) {
        toast({
          title: "Insufficient Balance",
          description: `You need at least ${AMOUNT} SOL plus gas fees`,
          variant: "destructive",
        });
        return { success: false, error: "Insufficient balance" };
      }
    } catch (err) {
      console.error('Failed to get balance:', err);
      toast({
        title: "Balance Check Failed",
        description: "Could not verify wallet balance. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Failed to check balance" };
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: AMOUNT * LAMPORTS_PER_SOL
      })
    );

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Request signature from user
    console.log('Requesting signature...');
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    // Send transaction
    console.log('Sending transaction...');
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Confirm transaction
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