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
import { Buffer } from 'buffer';

// Make buffer available globally for web3.js
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Constants
const TUZEMOON_COST = 0.0001; // Test amount
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const RPC_URL = "https://lingering-radial-wildflower.solana-mainnet.quiknode.pro/2401cf6c3ba08ec561ca8b671467fedb78b2ef71";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkPhantomWallet = async () => {
  console.log('Checking Phantom wallet availability...');
  
  if (typeof window === 'undefined') {
    console.error('Window object is undefined');
    return false;
  }

  // Check if Phantom is installed
  if (!window.solana) {
    console.error('Phantom wallet not found. Please install Phantom wallet.');
    toast({
      title: "Wallet Not Found",
      description: "Please install Phantom wallet to continue",
      variant: "destructive",
    });
    return false;
  }

  // Check if it's actually Phantom
  if (!window.solana.isPhantom) {
    console.error('Not a Phantom wallet');
    toast({
      title: "Invalid Wallet",
      description: "Please use Phantom wallet to continue",
      variant: "destructive",
    });
    return false;
  }

  try {
    console.log('Attempting to connect to Phantom wallet...');
    // Only try to connect if not already connected
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

const verifyRecipientAccount = async (
  connection: Connection,
  recipientPubkey: PublicKey
) => {
  try {
    console.log('Verifying recipient account:', recipientPubkey.toString());
    const accountInfo = await connection.getAccountInfo(recipientPubkey);
    
    if (!accountInfo) {
      console.error('Recipient account not found');
      return false;
    }
    
    console.log('Recipient account verified:', {
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toString(),
      executable: accountInfo.executable
    });
    
    return true;
  } catch (error) {
    console.error('Error verifying recipient account:', error);
    return false;
  }
};

const simulateTransaction = async (
  connection: Connection,
  transaction: Transaction
) => {
  try {
    console.log('Simulating transaction...');
    const simulation = await connection.simulateTransaction(transaction);
    
    console.log('Transaction simulation result:', {
      err: simulation.value.err,
      logs: simulation.value.logs,
      unitsConsumed: simulation.value.unitsConsumed
    });
    
    return !simulation.value.err;
  } catch (error) {
    console.error('Transaction simulation failed:', error);
    return false;
  }
};

const createAndSignTransaction = async (
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number,
  connection: Connection
) => {
  console.log('Creating transaction with params:', {
    from: fromPubkey.toString(),
    to: toPubkey.toString(),
    amount: lamports / LAMPORTS_PER_SOL,
    timestamp: new Date().toISOString()
  });

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

  // Add a memo to make the transaction more descriptive in the wallet
  transaction.add(
    new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: 0, // No additional transfer
      })
    )
  );

  // Simulate transaction before signing
  const isSimulationSuccessful = await simulateTransaction(connection, transaction);
  if (!isSimulationSuccessful) {
    throw new Error('Transaction simulation failed');
  }

  if (!window.solana) {
    throw new Error('Phantom wallet not found');
  }

  console.log('Requesting transaction signature...');
  const signed = await window.solana.signTransaction(transaction);
  
  return { signed, blockhash, lastValidBlockHeight };
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
    if (!window.solana) {
      throw new Error('Phantom wallet not available');
    }

    let walletResponse;
    try {
      console.log('Connecting to wallet...');
      walletResponse = await window.solana.connect();
      console.log('Wallet connected:', walletResponse.publicKey.toString());
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return { 
        success: false, 
        error: error.message || "Failed to connect wallet" 
      };
    }

    // Create connection
    console.log('Creating Solana connection...');
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed' as Commitment,
      confirmTransactionInitialTimeout: 60000
    });

    // Verify recipient account
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);
    if (!await verifyRecipientAccount(connection, toPubkey)) {
      return {
        success: false,
        error: "Invalid recipient account"
      };
    }

    // Prepare transaction
    const fromPubkey = new PublicKey(walletResponse.publicKey.toString());
    const lamports = TUZEMOON_COST * LAMPORTS_PER_SOL;

    // Create and sign transaction
    const { signed, blockhash, lastValidBlockHeight } = await createAndSignTransaction(
      fromPubkey,
      toPubkey,
      lamports,
      connection
    );

    // Send transaction
    try {
      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(
        Buffer.from(signed.serialize())
      );
      
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
      const logResponse = await supabase.functions.invoke('log-transaction', {
        body: {
          user_id: session.user.id,
          meme_id: memeId,
          amount: TUZEMOON_COST,
          transaction_status: 'completed',
          wallet_address: fromPubkey.toString(),
          transaction_signature: signature
        }
      });

      if (logResponse.error) {
        console.error('Error logging transaction:', logResponse.error);
      }

      return { success: true, signature };
    } catch (error: any) {
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
  } catch (error: any) {
    console.error('Payment process error:', error);
    return { 
      success: false, 
      error: error.message || "Payment process failed" 
    };
  }
};