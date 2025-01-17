import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const NETWORK = 'mainnet-beta';
const SOLANA_ENDPOINT = clusterApiUrl(NETWORK);

interface TransactionConfirmation {
  value: {
    err: string | null;
  };
}

export const connectWallet = async () => {
  try {
    // Check if Phantom is installed
    if (!window.solana?.isPhantom) {
      console.log('Phantom wallet not detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Create connection instance
    const connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
    
    // Check if we're on the correct network
    const network = await connection.getVersion();
    console.log('Connected to network:', network);

    // Connect to wallet
    console.log('Connecting to Phantom wallet...');
    try {
      const response = await window.solana.connect({
        onlyIfTrusted: false
      });
      
      // Create PublicKey instance from the response
      const publicKey = new PublicKey(response.publicKey.toString());
      console.log('Wallet connected:', publicKey.toString());
      
      return { success: true, publicKey: publicKey.toString() };
    } catch (connectError: any) {
      console.error('Connection error details:', connectError);
      
      if (connectError.message?.includes('User rejected')) {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the connection request",
          variant: "destructive",
        });
        return { success: false, error: "User rejected connection" };
      }

      // Handle 403 Access Forbidden error
      if (connectError.code === 403 || connectError.message?.includes('forbidden')) {
        toast({
          title: "Connection Failed",
          description: "Please make sure Phantom wallet is unlocked and try again",
          variant: "destructive",
        });
        return { success: false, error: "Access forbidden - wallet may be locked" };
      }

      throw connectError;
    }
  } catch (error: any) {
    console.error('Connection error:', error);
    toast({
      title: "Connection Failed",
      description: error.message || "Failed to connect to wallet. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const sendPayment = async (amount: number, memeId: string) => {
  try {
    console.log('Starting payment process...', { amount, memeId, network: NETWORK });

    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet not installed");
    }

    // Connect wallet if not connected
    if (!window.solana.isConnected) {
      const connectionResult = await connectWallet();
      if (!connectionResult.success) {
        throw new Error("Failed to connect wallet");
      }
    }

    const connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
    const fromPubkey = new PublicKey(window.solana.publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Check balance with buffer for fees
    const balance = await connection.getBalance(fromPubkey);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    const minimumRequired = requiredAmount + (0.01 * LAMPORTS_PER_SOL); // Buffer for fees
    
    console.log('Balance check:', {
      balance: balance / LAMPORTS_PER_SOL,
      required: amount,
      withFees: minimumRequired / LAMPORTS_PER_SOL
    });

    if (balance < minimumRequired) {
      throw new Error(`Insufficient balance. Required: ${amount + 0.01} SOL`);
    }

    // Create transaction
    console.log('Creating transaction...');
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: requiredAmount
      })
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
    console.log('Requesting signature...');
    try {
      const signedTransaction = await window.solana.signTransaction(transaction);
      console.log('Transaction signed, sending...');
      
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction sent:', signature);

      // Wait for confirmation with timeout
      console.log('Waiting for confirmation...');
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
        )
      ]) as TransactionConfirmation;

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      console.log('Transaction confirmed:', signature);

      // Record transaction in database
      const { error: dbError } = await supabase
        .from('TuzemoonPayments')
        .insert({
          meme_id: parseInt(memeId),
          user_id: (await supabase.auth.getUser()).data.user?.id,
          transaction_signature: signature,
          amount: amount,
          transaction_status: 'success',
          wallet_address: fromPubkey.toString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
      }

      toast({
        title: "Payment Successful",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      });

      return { success: true, signature };
    } catch (txError: any) {
      if (txError.message?.includes('User rejected')) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the transaction",
          variant: "destructive",
        });
        return { success: false, error: "User rejected transaction" };
      }
      throw txError;
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    
    const errorMessage = error.message || "Transaction failed";
    
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { success: false, error: errorMessage };
  }
};