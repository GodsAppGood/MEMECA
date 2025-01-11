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
const TUZEMOON_COST = 0.0001; // Changed from 0.1 to 0.0001 for testing
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const RPC_URL = "https://lingering-radial-wildflower.solana-mainnet.quiknode.pro/2401cf6c3ba08ec561ca8b671467fedb78b2ef71";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkPhantomWallet = async () => {
  console.log('Checking Phantom wallet availability...');
  
  if (typeof window === 'undefined') {
    console.error('Window object is undefined');
    return false;
  }

  if (!window.solana) {
    console.error('window.solana is undefined');
    return false;
  }

  if (!window.solana.isPhantom) {
    console.error('Not a Phantom wallet');
    return false;
  }

  try {
    console.log('Attempting to connect to Phantom wallet...');
    if (!window.solana.isConnected) {
      await window.solana.connect({ onlyIfTrusted: true })
        .catch(() => console.log('Not previously connected'));
    }
    
    const walletStatus = {
      isPhantom: window.solana.isPhantom,
      isConnected: window.solana.isConnected,
      hasPublicKey: !!window.solana.publicKey,
      publicKeyStr: window.solana.publicKey?.toString()
    };
    
    console.log('Phantom wallet status:', walletStatus);
    return true;
  } catch (error) {
    console.error('Error checking Phantom wallet:', error);
    return false;
  }
};

const authenticateWallet = async (walletAddress: string) => {
  try {
    console.log('Starting wallet authentication for:', walletAddress);
    
    // Generate nonce
    const { data: nonceData, error: nonceError } = await supabase.functions.invoke('wallet-auth', {
      body: { 
        walletAddress,
        action: 'generate-nonce'
      }
    });

    if (nonceError || !nonceData?.nonce) {
      console.error('Failed to generate nonce:', nonceError);
      return { success: false, error: 'Failed to generate nonce' };
    }

    console.log('Nonce generated successfully');

    // Sign message
    const message = new TextEncoder().encode(nonceData.nonce);
    let signature;
    try {
      signature = await window.solana.signMessage(message, 'utf8');
      console.log('Message signed successfully');
    } catch (error) {
      console.error('Failed to sign message:', error);
      return { success: false, error: 'Failed to sign message' };
    }

    // Verify signature
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke('wallet-auth', {
      body: {
        walletAddress,
        signature: Array.from(signature).toString(),
        nonce: nonceData.nonce,
        action: 'verify-signature'
      }
    });

    if (verifyError || !verifyData?.session) {
      console.error('Failed to verify signature:', verifyError);
      return { success: false, error: 'Failed to verify signature' };
    }

    console.log('Wallet authentication successful');
    return { success: true };
  } catch (error) {
    console.error('Error in wallet authentication:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  console.log('Starting payment process for meme:', { memeId, memeTitle });

  try {
    // Check for Phantom wallet
    if (!await checkPhantomWallet()) {
      return { 
        success: false, 
        error: "Phantom wallet not found or not connected" 
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

    // Connect wallet
    let walletResponse;
    try {
      console.log('Connecting to wallet...');
      walletResponse = await window.solana.connect();
      console.log('Wallet connected:', walletResponse.publicKey.toString());
    } catch (error) {
      console.error('Wallet connection error:', error);
      return { 
        success: false, 
        error: error.message || "Failed to connect wallet" 
      };
    }

    // Authenticate wallet
    const authResult = await authenticateWallet(walletResponse.publicKey.toString());
    if (!authResult.success) {
      return { 
        success: false, 
        error: authResult.error || "Wallet authentication failed" 
      };
    }

    // Create connection
    console.log('Creating Solana connection...');
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });

    // Prepare transaction
    console.log('Preparing transaction...');
    const fromPubkey = new PublicKey(walletResponse.publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);
    const lamports = TUZEMOON_COST * LAMPORTS_PER_SOL;

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
    try {
      console.log('Requesting transaction signature...');
      const signed = await window.solana.signTransaction(transaction);
      
      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      console.log('Confirming transaction...');
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log('Transaction confirmed:', signature);

      // Log successful transaction
      await supabase.functions.invoke('log-transaction', {
        body: {
          user_id: session.user.id,
          meme_id: memeId,
          amount: TUZEMOON_COST,
          transaction_status: 'completed',
          wallet_address: fromPubkey.toString(),
          transaction_signature: signature
        }
      });

      return { success: true, signature };
    } catch (error) {
      console.error('Transaction error:', error);
      
      // Log failed transaction
      await supabase.functions.invoke('log-transaction', {
        body: {
          user_id: session.user.id,
          meme_id: memeId,
          amount: TUZEMOON_COST,
          transaction_status: 'failed',
          error_message: error.message,
          wallet_address: fromPubkey.toString()
        }
      });

      return { 
        success: false, 
        error: error.message || "Transaction failed" 
      };
    }
  } catch (error) {
    console.error('Payment process error:', error);
    return { 
      success: false, 
      error: error.message || "Payment process failed" 
    };
  }
};