import { supabase } from "@/integrations/supabase/client";

const RECIPIENT_ADDRESS = "3ni66gLWZjSppB6vBSZxAMpJWV6PqLypznECKD5wFHhD";
const AMOUNT = 0.1;

export const sendSolPayment = async (memeId: string, memeTitle: string) => {
  try {
    // Create Solana Pay URL with all required parameters
    const solanaPayUrl = new URL("https://solana.com/pay");
    solanaPayUrl.searchParams.append("recipient", RECIPIENT_ADDRESS);
    solanaPayUrl.searchParams.append("amount", AMOUNT.toString());
    solanaPayUrl.searchParams.append("label", "Tuzemoon");
    solanaPayUrl.searchParams.append("message", `Payment for featuring meme: ${memeTitle}`);
    solanaPayUrl.searchParams.append("redirect_url", `${window.location.origin}/dashboard`);

    // Log the transaction attempt
    await supabase.from("TransactionLogs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      meme_id: memeId,
      transaction_status: "pending",
      amount: AMOUNT,
      wallet_address: RECIPIENT_ADDRESS
    });

    // Open Solana Pay URL in new window
    window.open(solanaPayUrl.toString(), "_blank");

    return {
      success: true,
      signature: "solana_pay_initiated",
    };
  } catch (error: any) {
    console.error("Solana Pay error:", error);

    // Log the failed transaction
    await supabase.from("TransactionLogs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      meme_id: memeId,
      transaction_status: "failed",
      amount: AMOUNT,
      error_message: error.message,
      wallet_address: RECIPIENT_ADDRESS
    });

    return {
      success: false,
      error: error.message
    };
  }
};