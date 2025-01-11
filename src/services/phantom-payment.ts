import { 
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Commitment,
} from "@solana/web3.js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Constants
const TUZEMOON_COST = 0.1;
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const RPC_URL = "https://lingering-radial-wildflower.solana-mainnet.quiknode.pro/2401cf6c3ba08ec561ca8b671467fedb78b2ef71";
const WS_URL = "wss://lingering-radial-wildflower.solana-mainnet.quiknode.pro/2401cf6c3ba08ec561ca8b671467fedb78b2ef71";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CONNECTION_TIMEOUT = 30000;
const WS_PING_INTERVAL = 10000;
const COMMITMENT_LEVEL: Commitment = "confirmed";

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

const testRPCConnection = async (connection: Connection): Promise<boolean> => {
  try {
    console.log('Testing RPC connection using getSlot...');
    const slot = await connection.getSlot();
    console.log('Successfully retrieved slot:', slot);
    return true;
  } catch (error) {
    console.error('Failed to get slot:', error);
    return false;
  }
};

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
      wsEndpoint: WS_URL,
      attempts: diagnostics.connectionAttempts + 1,
      previousStatus: diagnostics.connectionStatus,
    });
    
    diagnostics.connectionStatus = 'connecting';
    diagnostics.connectionAttempts++;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection validation timed out')), CONNECTION_TIMEOUT);
    });

    // Test basic connection and get slot
    const isRPCWorking = await testRPCConnection(connection);
    if (!isRPCWorking) {
      throw new Error('RPC connection test failed');
    }

    const testPromise = Promise.all([
      connection.getVersion(),
      connection.getRecentBlockhash(),
      connection.getBlockHeight()
    ]);

    const [version, blockhash, blockHeight] = await Promise.race([
      testPromise,
      timeoutPromise
    ]) as [any, { blockhash: string }, number];

    const connectionDetails = {
      version,
      blockHeight,
      blockhash: blockhash.blockhash.slice(0, 8) + '...',
      timestamp: new Date().toISOString(),
      rpcEndpoint: RPC_URL,
      wsEndpoint: WS_URL,
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

    if (errorMessage.includes('403')) {
      toast({
        title: "Access Error",
        description: "Unable to access Solana network. Please check QuickNode configuration.",
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
      wsEndpoint: WS_URL,
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

const checkPhantomWallet = async () => {
  console.log('Checking Phantom wallet availability...');
  
  // First check if window.solana exists
  if (typeof window === 'undefined' || !window.solana) {
    console.error('window.solana is undefined - Phantom wallet not found');
    return false;
  }
  
  // Then check if it's actually Phantom
  if (!window.solana.isPhantom) {
    console.error('window.solana.isPhantom is false - Not a Phantom wallet');
    return false;
  }

  try {
    // Try to reconnect if already authorized
    if (!window.solana.isConnected) {
      await window.solana.connect({ onlyIfTrusted: true })
        .catch(() => console.log('Not previously connected, will prompt user'));
    }
    
    console.log('Phantom wallet status:', {
      isPhantom: window.solana.isPhantom,
      isConnected: window.solana.isConnected,
      hasPublicKey: !!window.solana.publicKey,
      publicKeyStr: window.solana.publicKey?.toString()
    });
    
    return true;
  } catch (error) {
    console.error('Error checking Phantom wallet:', error);
    return true; // Still return true as the wallet exists, just not connected
  }
};

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  let connection: Connection | null = null;
  
  try {
    console.log('Starting payment process for meme:', { memeId, memeTitle });

    // Check for Phantom wallet first
    if (!await checkPhantomWallet()) {
      console.error('Phantom wallet check failed');
      return { 
        success: false, 
        error: "Phantom wallet not found. Please install Phantom wallet to continue." 
      };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return { 
        success: false, 
        error: "User not authenticated" 
      };
    }

    const fromWallet = window.solana;
    
    // Ensure wallet is connected
    try {
      console.log('Connecting to Phantom wallet...');
      const resp = await fromWallet.connect();
      console.log('Wallet connected successfully:', resp.publicKey.toString());
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        return { success: false, error: "Wallet connection rejected by user" };
      }
      throw error;
    }

    // Verify wallet is still connected and has publicKey
    if (!fromWallet.publicKey) {
      console.error('No public key available after connection');
      throw new Error('Wallet connection lost or publicKey not available');
    }

    // Create connection to Solana network
    connection = await createSolanaConnection();
    if (!connection) {
      throw new Error('Failed to establish connection to Solana network');
    }

    const fromPubkey = new PublicKey(fromWallet.publicKey.toString());
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
    console.log('Getting latest blockhash...');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({
      commitment: 'finalized'
    });

    console.log('Got blockhash:', { blockhash, lastValidBlockHeight });

    // Create transaction with explicit lamports calculation
    const lamports = TUZEMOON_COST * LAMPORTS_PER_SOL;
    console.log('Creating transaction with lamports:', lamports);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    // Set transaction properties
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    try {
      // Request signature from user with explicit error handling
      console.log('Requesting transaction signature from user...');
      const signed = await fromWallet.signTransaction(transaction);
      console.log('Transaction signed by user');

      if (!signed) {
        throw new Error("Failed to sign transaction");
      }

      // Send the transaction with explicit options
      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      });
      console.log('Transaction sent:', signature);
      
      // Wait for transaction confirmation with detailed logging
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
      
      // Enhanced error handling for Phantom-specific errors
      let errorMessage = "Transaction failed";
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === 4900) {
        errorMessage = "Wallet disconnected";
      } else if (error.code === -32603) {
        errorMessage = "Transaction simulation failed";
      }
      
      // Log failed transaction
      await logTransaction({
        user_id: session.user.id,
        meme_id: memeId,
        amount: TUZEMOON_COST,
        transaction_status: 'failed',
        error_message: errorMessage,
        wallet_address: walletAddress
      });

      return { 
        success: false, 
        error: errorMessage
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
