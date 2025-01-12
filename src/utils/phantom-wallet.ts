import { toast } from "@/hooks/use-toast";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constants
const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Connects to Phantom Wallet and returns the public key
 */
export const connectPhantomWallet = async (): Promise<string | null> => {
  try {
    console.log('Attempting to connect to Phantom Wallet...');
    
    // Check if Phantom Wallet is installed
    if (!window.solana || !window.solana.isPhantom) {
      console.error('Phantom wallet not detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom Wallet to continue. Redirecting to phantom.app...",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return null;
    }

    // Connect to wallet
    const response = await window.solana.connect();
    const publicKeyString = response.publicKey.toString();
    console.log('Wallet connected successfully:', {
      publicKey: publicKeyString,
      network: SOLANA_NETWORK,
      timestamp: new Date().toISOString()
    });
    
    return publicKeyString;
  } catch (error: any) {
    console.error('Wallet connection error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Connection Error",
      description: error.message === 'User rejected the request.' 
        ? "You declined the connection request. Please try again."
        : `Failed to connect wallet: ${error.message}`,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Creates a payment transaction with retry mechanism
 */
export const createPaymentTransaction = async (
  amount: number,
  recipientAddress: string,
  retryCount = 0
): Promise<Transaction | null> => {
  try {
    console.log('Creating payment transaction:', {
      amount,
      recipient: recipientAddress,
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });

    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    const connection = new Connection(SOLANA_ENDPOINT);
    
    if (!window.solana.publicKey) {
      throw new Error("Wallet not connected");
    }

    // Convert the wallet's public key to a proper Solana PublicKey object
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

    console.log('Transaction created successfully:', {
      blockhash,
      timestamp: new Date().toISOString()
    });

    return transaction;
  } catch (error: any) {
    console.error('Transaction creation error:', {
      error: error.message,
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying transaction creation (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY);
      return createPaymentTransaction(amount, recipientAddress, retryCount + 1);
    }

    toast({
      title: "Transaction Error",
      description: error.message || "Failed to create transaction",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Signs and sends a transaction with retry mechanism
 */
export const signAndSendTransaction = async (
  transaction: Transaction,
  retryCount = 0
): Promise<string | null> => {
  try {
    console.log('Initiating transaction signing:', {
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });

    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    toast({
      title: "Action Required",
      description: "Please sign the transaction in your Phantom wallet",
    });

    // Sign transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    console.log('Transaction signed successfully');
    
    // Connect to Solana network
    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Send transaction
    console.log('Sending transaction to network...');
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation with increased timeout
    console.log('Waiting for transaction confirmation...');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction confirmed successfully:', {
      signature,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Success",
      description: "Payment completed successfully! Transaction signature: " + signature.slice(0, 8) + "...",
    });

    return signature;
  } catch (error: any) {
    console.error('Transaction error:', {
      error: error.message,
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });
    
    // Handle user rejection specifically
    if (error.message.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction. You can try again when ready.",
        variant: "destructive",
      });
      return null;
    }

    // Retry logic for other errors
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying transaction (${retryCount + 1}/${MAX_RETRIES})...`);
      toast({
        title: "Retrying Transaction",
        description: `Attempt ${retryCount + 1} of ${MAX_RETRIES}...`,
      });
      await sleep(RETRY_DELAY);
      return signAndSendTransaction(transaction, retryCount + 1);
    }

    toast({
      title: "Transaction Failed",
      description: `Payment could not be completed: ${error.message}. Please try again later.`,
      variant: "destructive",
    });
    return null;
  }
};