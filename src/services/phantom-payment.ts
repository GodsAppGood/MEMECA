import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const TUZEMOON_COST = 0.1; // SOL
const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    if (!window.solana?.isPhantom) {
      return { 
        success: false, 
        error: "Phantom wallet is not installed" 
      };
    }

    // Connect to Solana network (using devnet for testing)
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const fromWallet = window.solana;

    // Get the public key of the connected wallet
    const fromPubkey = new PublicKey(await (await fromWallet.connect()).publicKey.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

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

    // Get current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: "User not authenticated" 
      };
    }

    // Create payment record with pending status
    const { error: insertError } = await supabase
      .from('TuzemoonPayments')
      .insert({
        meme_id: parseInt(memeId),
        user_id: session.user.id,
        amount: TUZEMOON_COST,
        transaction_status: 'pending'
      });

    if (insertError) {
      console.error("Error creating payment record:", insertError);
      return { 
        success: false, 
        error: "Failed to create payment record" 
      };
    }

    // Sign and send transaction
    try {
      const signed = await fromWallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      // Update payment record with success status
      const { error: updateError } = await supabase
        .from('TuzemoonPayments')
        .update({
          transaction_signature: signature,
          transaction_status: 'completed'
        })
        .eq('meme_id', parseInt(memeId))
        .eq('user_id', session.user.id)
        .eq('transaction_status', 'pending');

      if (updateError) {
        console.error("Error updating payment record:", updateError);
        return { 
          success: false, 
          error: "Failed to update payment record" 
        };
      }

      return { success: true, signature };
    } catch (error: any) {
      console.error("Transaction error:", error);
      
      // Update payment record with failed status
      await supabase
        .from('TuzemoonPayments')
        .update({
          transaction_status: 'failed',
          transaction_signature: null
        })
        .eq('meme_id', parseInt(memeId))
        .eq('user_id', session.user.id)
        .eq('transaction_status', 'pending');

      return { 
        success: false, 
        error: error.message || "Transaction failed" 
      };
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    return { 
      success: false, 
      error: error.message || "Payment process failed" 
    };
  }
};