import { toast } from "@/hooks/use-toast";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constants
const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validates the current network connection
 */
const validateNetwork = async (connection: Connection): Promise<boolean> => {
  try {
    const genesisHash = await connection.getGenesisHash();
    console.log('Network validation:', {
      network: SOLANA_NETWORK,
      genesisHash,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Network validation failed:', {
      error,
      network: SOLANA_NETWORK,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

/**
 * Connects to Phantom Wallet and returns the public key
 */
export const connectPhantomWallet = async (): Promise<string | null> => {
  try {
    console.log('Attempting to connect to Phantom Wallet...');
    
    if (!window.solana || !window.solana.isPhantom) {
      console.error('Phantom wallet not detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom Wallet from phantom.app to proceed",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return null;
    }

    // Connect to wallet
    const response = await window.solana.connect();
    const publicKeyString = response.publicKey.toString();
    
    // Validate network
    const connection = new Connection(SOLANA_ENDPOINT);
    const isValidNetwork = await validateNetwork(connection);
    
    if (!isValidNetwork) {
      toast({
        title: "Network Error",
        description: `Please switch your wallet to ${SOLANA_NETWORK.toUpperCase()} network`,
        variant: "destructive",
      });
      return null;
    }

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
    
    const errorMessage = error.message === 'User rejected the request.' 
      ? "You declined the connection request. Please try again."
      : `Failed to connect wallet: ${error.message}`;
    
    toast({
      title: "Connection Error",
      description: errorMessage,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Creates a payment transaction with enhanced error handling
 */
export const createPaymentTransaction = async (
  amount: number,
  recipientAddress: string,
  retryCount = 0
): Promise<Transaction | null> => {
  try {
    if (!window.solana?.publicKey) {
      throw new Error("Wallet not connected");
    }

    const connection = new Connection(SOLANA_ENDPOINT);
    const sender = window.solana.publicKey;
    const recipient = new PublicKey(recipientAddress);

    // Validate balance
    const balance = await connection.getBalance(sender);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    
    if (balance < requiredAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${amount} SOL plus gas fees. Current balance: ${balance / LAMPORTS_PER_SOL} SOL`,
        variant: "destructive",
      });
      return null;
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: requiredAmount,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender;

    return transaction;
  } catch (error: any) {
    console.error('Transaction creation error:', {
      error: error.message,
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });

    if (retryCount < MAX_RETRIES) {
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
 * Signs and sends a transaction with enhanced error handling
 */
export const signAndSendTransaction = async (
  transaction: Transaction,
  retryCount = 0
): Promise<string | null> => {
  try {
    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    toast({
      title: "Action Required",
      description: "Please sign the transaction in your Phantom wallet",
    });

    const signedTransaction = await window.solana.signTransaction(transaction);
    const connection = new Connection(SOLANA_ENDPOINT);
    
    console.log('Sending transaction to network...');
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    console.log('Waiting for confirmation...');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed to confirm");
    }

    console.log('Transaction confirmed:', {
      signature,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Success",
      description: `Payment completed! Transaction ID: ${signature.slice(0, 8)}...`,
    });

    return signature;
  } catch (error: any) {
    console.error('Transaction error:', {
      error: error.message,
      attempt: retryCount + 1,
      timestamp: new Date().toISOString()
    });
    
    if (error.message.includes('User rejected')) {
      toast({
        title: "Transaction Cancelled",
        description: "You cancelled the transaction. Try again when ready.",
        variant: "destructive",
      });
      return null;
    }

    if (retryCount < MAX_RETRIES) {
      toast({
        title: "Retrying Transaction",
        description: `Attempt ${retryCount + 1} of ${MAX_RETRIES}...`,
      });
      await sleep(RETRY_DELAY);
      return signAndSendTransaction(transaction, retryCount + 1);
    }

    toast({
      title: "Transaction Failed",
      description: `Error: ${error.message}. Please try again later.`,
      variant: "destructive",
    });
    return null;
  }
};