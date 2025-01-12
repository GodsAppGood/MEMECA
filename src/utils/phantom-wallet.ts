import { toast } from "@/hooks/use-toast";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constants
const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;

export const connectPhantomWallet = async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      toast({
        title: "Wallet Error",
        description: "Phantom wallet is not installed",
        variant: "destructive",
      });
      return null;
    }

    const response = await window.solana.connect();
    const publicKeyString = response.publicKey.toString();
    console.log('Wallet connected:', publicKeyString);
    return publicKeyString;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    toast({
      title: "Connection Error",
      description: "Failed to connect wallet",
      variant: "destructive",
    });
    return null;
  }
};

export const createPaymentTransaction = async (
  amount: number,
  recipientAddress: string,
  memo: string = ""
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
  } catch (error) {
    console.error('Error creating transaction:', error);
    toast({
      title: "Transaction Error",
      description: "Failed to create transaction",
      variant: "destructive",
    });
    return null;
  }
};

export const signAndSendTransaction = async (transaction: Transaction): Promise<string | null> => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet not found");
    }

    // Sign transaction
    const signedTransaction = await window.solana.signTransaction(transaction);
    
    // Connect to Solana network
    const connection = new Connection(SOLANA_ENDPOINT);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);

    console.log('Transaction successful:', signature);
    toast({
      title: "Success",
      description: "Payment completed successfully",
    });

    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    toast({
      title: "Transaction Failed",
      description: "Payment could not be completed",
      variant: "destructive",
    });
    return null;
  }
};