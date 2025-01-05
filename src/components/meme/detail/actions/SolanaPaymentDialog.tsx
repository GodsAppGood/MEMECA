import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SOLANA_NETWORK = "devnet";
const RECIPIENT_ADDRESS = "YOUR_RECIPIENT_WALLET_ADDRESS"; // Replace with your actual wallet address

interface SolanaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
  onError: (error: Error) => void;
}

export const SolanaPaymentDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  onError 
}: SolanaPaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const handleSolanaPayment = async () => {
    if (!publicKey) {
      onError(new Error("Please connect your Solana wallet to proceed"));
      return;
    }

    try {
      setIsProcessing(true);
      const connection = new Connection(
        `https://api.${SOLANA_NETWORK}.solana.com`,
        'confirmed'
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(RECIPIENT_ADDRESS),
          lamports: LAMPORTS_PER_SOL * 0.1, // 0.1 SOL
        })
      );

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) throw new Error('Transaction failed');

      await onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Tuzemoon by Memeca!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>To add this meme to Tuzemoon, you'll need to pay 0.1 Solana.</p>
            {!publicKey && (
              <div className="flex justify-center">
                <WalletMultiButton />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSolanaPayment}
            disabled={!publicKey || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay 0.1 SOL'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};