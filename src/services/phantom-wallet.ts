import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const SOLANA_ENDPOINT = "https://api.mainnet-beta.solana.com";

export const connectWallet = async () => {
  try {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return { success: false, error: "Please install Phantom wallet" };
    }

    const response = await window.solana.connect();
    return { success: true, publicKey: response.publicKey.toString() };
  } catch (error: any) {
    console.error('Wallet connection error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPayment = async (amount: number, memeId: string) => {
  try {
    // Простая проверка кошелька
    if (!window.solana?.isPhantom) {
      toast({
        title: "Wallet Not Found",
        description: "Please install Phantom wallet",
        variant: "destructive",
      });
      return { success: false, error: "Phantom wallet not installed" };
    }

    // Подключаемся к кошельку если не подключены
    if (!window.solana.isConnected) {
      await window.solana.connect();
    }

    const connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
    const fromPubkey = new PublicKey(window.solana.publicKey!.toString());
    const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

    // Проверяем баланс
    const balance = await connection.getBalance(fromPubkey);
    const requiredAmount = amount * LAMPORTS_PER_SOL;
    
    if (balance < requiredAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${amount} SOL plus gas fees`,
        variant: "destructive",
      });
      return { success: false, error: "Insufficient balance" };
    }

    // Создаем транзакцию
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: requiredAmount
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Подписываем транзакцию
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Ждем подтверждения
    await connection.confirmTransaction(signature);

    // Записываем в базу
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
  } catch (error: any) {
    console.error('Payment error:', error);
    toast({
      title: "Payment Failed",
      description: error.message || "Transaction failed",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};