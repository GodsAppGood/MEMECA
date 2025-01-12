import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { createPaymentTransaction, signAndSendTransaction } from "@/utils/phantom-wallet";

const RECIPIENT_WALLET = "YOUR_RECIPIENT_WALLET_ADDRESS"; // Replace with actual wallet address

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string,
  amount: number = 0.1 // Default amount in SOL
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    // Create transaction
    const transaction = await createPaymentTransaction(
      amount,
      RECIPIENT_WALLET
    );

    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    // Sign and send transaction
    const signature = await signAndSendTransaction(transaction);

    if (!signature) {
      throw new Error("Transaction failed");
    }

    // Log successful transaction
    const { error: logError } = await supabase
      .from('TransactionLogs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        meme_id: parseInt(memeId),
        transaction_status: 'completed',
        amount: amount,
        transaction_signature: signature,
      });

    if (logError) {
      console.error('Error logging transaction:', logError);
    }

    return { 
      success: true, 
      signature 
    };
  } catch (error: any) {
    console.error('Payment error:', error);
    
    // Log failed transaction
    const { error: logError } = await supabase
      .from('TransactionLogs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        meme_id: parseInt(memeId),
        transaction_status: 'failed',
        error_message: error.message,
      });

    if (logError) {
      console.error('Error logging failed transaction:', logError);
    }

    return { 
      success: false, 
      error: error.message 
    };
  }
};