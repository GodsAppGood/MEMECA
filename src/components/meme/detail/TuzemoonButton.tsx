import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RECIPIENT_ADDRESS = "E4uYdn6FcTZFasVmt7BfqZaGDt3rCniykMv2bXUJ1PNu";
const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";

interface TuzemoonButtonProps {
  memeId: string;
  memeTitle: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<void>;
}

export const TuzemoonButton = ({
  memeId,
  memeTitle,
  isFeatured,
  isAdmin,
  isVerified,
  onUpdate
}: TuzemoonButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const activateTuzemoon = async (userId: string, signature?: string) => {
    try {
      console.log('Starting Tuzemoon activation:', {
        memeId,
        userId,
        signature,
        isAdmin
      });

      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      if (signature) {
        console.log('Recording payment with signature:', signature);
        const { error: paymentError } = await supabase
          .from('TuzemoonPayments')
          .insert([{
            meme_id: parseInt(memeId),
            user_id: userId,
            transaction_signature: signature,
            amount: 0.1,
            transaction_status: 'success',
            wallet_address: window.solana?.publicKey?.toString()
          }]);

        if (paymentError) {
          console.error('Payment record creation failed:', paymentError);
          throw new Error('Failed to record payment');
        }
      }

      console.log('Updating meme Tuzemoon status...');
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: !isFeatured,
          tuzemoon_until: !isFeatured ? tuzemoonUntil : null
        })
        .eq('id', parseInt(memeId));

      if (updateError) {
        console.error('Meme status update failed:', updateError);
        throw new Error('Failed to activate Tuzemoon status');
      }

      await onUpdate();

      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'activated' : 'deactivated'} Tuzemoon status for this meme`,
      });

      return true;
    } catch (error: any) {
      console.error('Tuzemoon activation error:', error);
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to update Tuzemoon status",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      console.log('Starting payment process...', {
        memeId,
        memeTitle,
        walletInstalled: !!window.solana?.isPhantom,
        walletConnected: window.solana?.isConnected,
        environment: import.meta.env.MODE
      });
      
      if (!window.solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        throw new Error("Please install Phantom wallet");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to continue");
      }

      if (!window.solana.isConnected) {
        toast({
          title: "Connecting Wallet",
          description: "Please approve the connection request in Phantom",
        });
        await window.solana.connect();
      }

      if (!window.solana.publicKey) {
        throw new Error("Wallet connection failed");
      }

      console.log('Creating Solana connection...');
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      
      const fromPubkey = new PublicKey(window.solana.publicKey.toString());
      const toPubkey = new PublicKey(RECIPIENT_ADDRESS);

      console.log('Checking wallet balance...');
      try {
        const balance = await connection.getBalance(fromPubkey);
        console.log('Current balance:', balance / LAMPORTS_PER_SOL, 'SOL');
        
        if (balance < 0.1 * LAMPORTS_PER_SOL) {
          throw new Error("Insufficient SOL balance. Please add funds to your wallet.");
        }
      } catch (error: any) {
        console.error('Balance check failed:', error);
        throw new Error('Failed to check wallet balance. Please try again.');
      }

      console.log('Creating transaction...');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 0.1 * LAMPORTS_PER_SOL
        })
      );

      console.log('Getting latest blockhash...');
      try {
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;
      } catch (error: any) {
        console.error('Blockhash fetch failed:', error);
        throw new Error('Network error. Please try again.');
      }

      console.log('Requesting signature...');
      const signedTransaction = await window.solana.signTransaction(transaction);
      
      console.log('Sending transaction...');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('Waiting for confirmation...', signature);
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      console.log('Transaction confirmed:', signature);
      
      const activationSuccess = await activateTuzemoon(user.id, signature);
      
      if (activationSuccess) {
        setIsModalOpen(false);
      }

    } catch (error: any) {
      console.error('Payment/activation error:', {
        error: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      toast({
        title: "Payment Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminActivation = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      await activateTuzemoon(user.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isAdmin) {
      handleAdminActivation();
    } else {
      setIsModalOpen(true);
    }
  };

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isFeatured ? "secondary" : "default"}
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Rocket className="h-4 w-4" />
        )}
        {isFeatured ? "Featured" : "Tuzemoon"}
      </Button>

      {!isAdmin && (
        <TuzemoonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePayment}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};