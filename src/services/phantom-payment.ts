import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TUZEMOON_COST = 0.1; // SOL

export const sendSolPayment = async (
  memeId: string,
  memeTitle: string
): Promise<{ success: boolean; signature?: string }> => {
  try {
    if (!window.solana?.isPhantom) {
      toast({
        title: "Wallet Error",
        description: "Phantom wallet is not installed",
        variant: "destructive",
      });
      return { success: false };
    }

    // Fetch the recipient wallet address from Supabase
    const { data: configData, error: configError } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'TUZEMOON_WALLET_ADDRESS')
      .single();

    if (configError || !configData?.value) {
      console.error('Error fetching wallet address:', configError);
      toast({
        title: "Configuration Error",
        description: "Unable to process payment at this time",
        variant: "destructive",
      });
      return { success: false };
    }

    // Connect to Solana network
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const fromWallet = window.solana;

    // Get the public key of the connected wallet
    const fromPubkey = new PublicKey(await (await fromWallet.connect()).publicKey.toString());
    const toPubkey = new PublicKey(configData.value);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: TUZEMOON_COST * LAMPORTS_PER_SOL,
      })
    );

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send transaction
    const signed = await fromWallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    // Get current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Record payment in database
    const { error: paymentError } = await supabase
      .from('TuzemoonPayments')
      .insert({
        meme_id: parseInt(memeId),
        user_id: session.user.id,
        transaction_signature: signature,
        amount: TUZEMOON_COST,
        status: 'completed'
      });

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
      throw new Error("Failed to record payment");
    }

    return { success: true, signature };
  } catch (error) {
    console.error("Payment error:", error);
    return { success: false };
  }
};