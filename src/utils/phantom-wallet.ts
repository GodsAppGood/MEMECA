import { toast } from "@/hooks/use-toast";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constants
const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;

/**
 * Connects to Phantom Wallet and returns the public key
 */
export const connectPhantomWallet = async (): Promise<string | null> => {
  try {
    // Check if Phantom Wallet is installed
    if (!window.solana || !window.solana.isPhantom) {
      toast({
        title: "Wallet Error",
        description: "Please install Phantom Wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return null;
    }

    // Connect to wallet
    const response = await window.solana.connect();
    const publicKeyString = response.publicKey.toString();
    console.log('Wallet connected:', publicKeyString);
    return publicKeyString;
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    toast({
      title: "Connection Error",
      description: error.message || "Failed to connect wallet",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Creates a payment transaction
 */
export const createPaymentTransaction = async (
  amount: number,
  recipientAddress: string,
): Promise<Transaction | null> => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Convert the wallet's public key to a proper Solana PublicKey object
    if (!window.solana.publicKey) {
      throw new Error("Wallet not connected");
    }
    const sender = new PublicKey(window.solana.publicKey.toString());
    const recipient = new PublicKey(recipientAddress);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;

    return transaction;
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    toast({
      title: "Transaction Error",
      description: error.message || "Failed to create transaction",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Signs and sends a transaction
 */
export const signAndSendTransaction = async (transaction: Transaction): Promise<string | null> => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    toast({
      title: "Action Required",
      description: "Please sign the transaction in your Phantom wallet",
    });

    // Sign transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    // Connect to Solana network
    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction successful:', signature);
    toast({
      title: "Success",
      description: "Payment completed successfully",
    });

    return signature;
  } catch (error: any) {
    console.error('Transaction failed:', error);
    
    // Handle user rejection specifically
    if (error.message.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Transaction Failed",
        description: error.message || "Payment could not be completed",
        variant: "destructive",
      });
    }
    return null;
  }
};