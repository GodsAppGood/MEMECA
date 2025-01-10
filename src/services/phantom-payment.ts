import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Commitment } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Constants
const TUZEMOON_COST = 0.1;
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const RPC_URL = "https://solana-api.projectserum.com";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CONNECTION_TIMEOUT = 30000;
const WS_PING_INTERVAL = 10000;
const COMMITMENT_LEVEL: Commitment = 'confirmed';

// Enhanced diagnostics
const diagnostics = {
  connectionAttempts: 0,
  lastError: null as Error | null,
  connectionStatus: 'disconnected' as 'disconnected' | 'connecting' | 'connected' | 'error',
  lastSuccessfulConnection: null as Date | null,
};

// HTTP Headers with detailed User-Agent
const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'Memeca/1.0.0 (Solana Payment Integration)',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Transaction logging with enhanced details
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
    console.log('Logging transaction with details:', {
      ...transactionDetails,
      timestamp: new Date().toISOString(),
      rpcEndpoint: RPC_URL,
      diagnostics: {
        connectionAttempts: diagnostics.connectionAttempts,
        connectionStatus: diagnostics.connectionStatus,
        lastSuccessfulConnection: diagnostics.lastSuccessfulConnection,
      }
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session for transaction logging');
      return false;
    }

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

// Enhanced connection validation with detailed diagnostics
const validateConnection = async (connection: Connection): Promise<boolean> => {
  try {
    console.log('Validating Solana connection...', {
      timestamp: new Date().toISOString(),
      rpcEndpoint: RPC_URL,
      attempts: diagnostics.connectionAttempts + 1,
      previousStatus: diagnostics.connectionStatus,
    });
    
    diagnostics.connectionStatus = 'connecting';
    diagnostics.connectionAttempts++;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection validation timed out')), CONNECTION_TIMEOUT);
    });

    const testPromise = Promise.all([
      connection.getVersion(),
      connection.getSlot(),
      connection.getRecentBlockhash(),
      connection.getBlockHeight()
    ]);

    const [version, slot, blockhash, blockHeight] = await Promise.race([
      testPromise,
      timeoutPromise
    ]) as [any, number, { blockhash: string }, number];

    const connectionDetails = {
      version,
      slot,
      blockHeight,
      blockhash: blockhash.blockhash.slice(0, 8) + '...',
      timestamp: new Date().toISOString(),
      rpcEndpoint: RPC_URL,
      commitment: COMMITMENT_LEVEL,
      attempts: diagnostics.connectionAttempts,
    };

    console.log('Connection validation successful:', connectionDetails);
    
    diagnostics.connectionStatus = 'connected';
    diagnostics.lastSuccessfulConnection = new Date();
    diagnostics.lastError = null;

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Connection validation failed:', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      endpoint: RPC_URL,
      attempts: diagnostics.connectionAttempts,
    });

    diagnostics.connectionStatus = 'error';
    diagnostics.lastError = error instanceof Error ? error : new Error(errorMessage);

    // Check for specific error types
    if (errorMessage.includes('403')) {
      toast({
        title: "Access Error",
        description: "Unable to access Solana network. Please try again later or contact support.",
        variant: "destructive"
      });
    } else if (errorMessage.includes('timeout')) {
      toast({
        title: "Connection Timeout",
        description: "Network response took too long. Please check your connection and try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connection Error",
        description: `Failed to validate Solana connection: ${errorMessage}`,
        variant: "destructive"
      });
    }

    return false;
  }
};

const createSolanaConnection = async (retryCount = 0): Promise<Connection | null> => {
  try {
    console.log(`Attempting to connect to Solana network (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    const connection = new Connection(RPC_URL, {
      commitment: COMMITMENT_LEVEL,
      confirmTransactionInitialTimeout: CONNECTION_TIMEOUT,
      wsEndpoint: "wss://api.mainnet-beta.solana.com",
      disableRetryOnRateLimit: false,
      httpHeaders: headers
    });

    let wsKeepAlive: NodeJS.Timeout;
    
    // WebSocket keep-alive with enhanced error handling
    const setupWebSocket = () => {
      wsKeepAlive = setInterval(async () => {
        try {
          await connection.getSlot();
        } catch (error) {
          console.error('WebSocket keep-alive failed:', error);
          toast({
            title: "Connection Warning",
            description: "Network connection unstable. Please check your internet connection.",
            variant: "destructive"
          });
        }
      }, WS_PING_INTERVAL);
    };

    // Validate connection
    const isValid = await validateConnection(connection);
    if (!isValid) {
      clearInterval(wsKeepAlive);
      throw new Error('Connection validation failed');
    }

    setupWebSocket();
    console.log('Successfully established Solana connection');
    
    // Clean up WebSocket keep-alive on connection close
    const cleanup = () => {
      clearInterval(wsKeepAlive);
      console.log('Cleaned up WebSocket keep-alive');
    };

    // Attach cleanup to connection object
    (connection as any).cleanup = cleanup;
    
    return connection;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Connection attempt ${retryCount + 1} failed:`, {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      retryCount
    });
    
    if (retryCount < MAX_RETRIES - 1) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
      return createSolanaConnection(retryCount + 1);
    }
    
    toast({
      title: "Connection Failed",
      description: `Unable to establish connection after ${MAX_RETRIES} attempts. Please try again later.`,
      variant: "destructive"
    });
    
    return null;
  }
};

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  let connection: Connection | null = null;
  
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
    connection = await createSolanaConnection();
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
    
    // Clean up WebSocket keep-alive if connection exists
    if (connection && (connection as any).cleanup) {
      (connection as any).cleanup();
    }
    
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
  } finally {
    // Ensure WebSocket keep-alive is cleaned up
    if (connection && (connection as any).cleanup) {
      (connection as any).cleanup();
    }
  }
};
