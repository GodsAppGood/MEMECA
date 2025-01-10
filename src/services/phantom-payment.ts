import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const TUZEMOON_COST = 0.1; // SOL
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const RPC_URL = "https://api.mainnet-beta.solana.com";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CONNECTION_TIMEOUT = 30000; // 30 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const logTransaction = async (transactionDetails: {
  user_id: string;
  meme_id: string;
  amount: number;
  transaction_status: string;
  error_message?: string;
  wallet_address?: string;
  transaction_signature?: string;
}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const response = await supabase.functions.invoke('log-transaction', {
      body: transactionDetails
    });

    if (!response.data?.success) {
      console.error('Transaction logging failed:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging transaction:', error);
    return false;
  }
};

const testConnection = async (connection: Connection): Promise<boolean> => {
  try {
    console.log('Testing Solana connection...');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection test timed out')), CONNECTION_TIMEOUT);
    });

    // Test multiple aspects of the connection
    const testPromise = Promise.all([
      connection.getVersion(),
      connection.getSlot(),
      connection.getRecentBlockhash()
    ]);

    // Race between the timeout and the test
    const [version, slot, blockhash] = await Promise.race([
      testPromise,
      timeoutPromise
    ]) as [any, number, { blockhash: string }];

    console.log('Connection test results:', {
      version,
      slot,
      blockhash: blockhash.blockhash.slice(0, 8) + '...' // Log partial blockhash for privacy
    });

    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

const createSolanaConnection = async (retryCount = 0): Promise<Connection | null> => {
  try {
    console.log(`Attempting to connect to Solana network (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
      wsEndpoint: "wss://api.mainnet-beta.solana.com",
    });

    // Test the connection thoroughly
    const isConnected = await testConnection(connection);
    if (!isConnected) {
      throw new Error('Connection test failed');
    }

    console.log('Successfully established Solana connection');
    return connection;
  } catch (error) {
    console.error(`Connection attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
      return createSolanaConnection(retryCount + 1);
    }
    
    return null;
  }
};

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    console.log('Starting payment process for meme:', { memeId, memeTitle });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return { 
        success: false, 
        error: "User not authenticated" 
      };
    }

    if (!window.solana?.isPhantom) {
      console.error('Phantom wallet not found');
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'failed',
        error_message: 'Phantom wallet not installed'
      });
      return { 
        success: false, 
        error: "Phantom wallet is not installed" 
      };
    }

    // Connect to Solana network with enhanced retry logic
    const connection = await createSolanaConnection();
    if (!connection) {
      const error = "Failed to establish connection to Solana network after multiple attempts. Please check your internet connection and try again.";
      console.error(error);
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'failed',
        error_message: error
      });
      return {
        success: false,
        error: "Network connection failed. Please check your internet connection and try again."
      };
    }

    const fromWallet = window.solana;
    const fromPubkey = new PublicKey(await (await fromWallet.connect()).publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);
    const walletAddress = fromPubkey.toString();

    console.log('Transaction details:', {
      from: fromPubkey.toString(),
      to: toPubkey.toString(),
      amount: TUZEMOON_COST
    });

    // Log initial transaction attempt
    await logTransaction({
      user_id: session.user.id,
      meme_id: memeId,
      amount: TUZEMOON_COST,
      transaction_status: 'pending',
      wallet_address: walletAddress
    });

    // Get recent blockhash with retry
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({
      commitment: 'finalized'
    });

    console.log('Got blockhash:', { blockhash, lastValidBlockHeight });

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: TUZEMOON_COST * LAMPORTS_PER_SOL,
      })
    );

    // Set transaction properties
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    try {
      // Request signature from user
      console.log('Requesting transaction signature from user...');
      const signed = await fromWallet.signTransaction(transaction);
      console.log('Transaction signed by user');

      // Send the transaction
      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
      console.log('Transaction sent:', signature);
      
      // Wait for transaction confirmation
      console.log('Waiting for transaction confirmation...');
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log('Transaction confirmed:', confirmation);

      // Log successful transaction
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'completed',
        wallet_address: walletAddress,
        transaction_signature: signature
      });

      return { success: true, signature };
    } catch (error: any) {
      console.error("Transaction error:", error);
      
      // Log failed transaction
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'failed',
        error_message: error.message,
        wallet_address: walletAddress
      });

      return { 
        success: false, 
        error: error.message || "Transaction failed" 
      };
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    
    // Log error if we have a session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'error',
        error_message: error.message
      });
    }

    // Provide more specific error messages based on error type
    let errorMessage = "Payment process failed. ";
    if (error.message.includes('timeout')) {
      errorMessage += "The network is responding slowly. Please try again.";
    } else if (error.message.includes('rejected')) {
      errorMessage += "The transaction was rejected. Please try again.";
    } else if (error.message.includes('insufficient')) {
      errorMessage += "Insufficient funds in your wallet.";
    } else {
      errorMessage += "Please check your connection and try again.";
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
};
