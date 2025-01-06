import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { TuzemoonModal } from "./TuzemoonModal";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

interface TuzemoonButtonProps {
  memeId: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<any>;
}

export const TuzemoonButton = ({ 
  memeId, 
  isFeatured, 
  isAdmin, 
  isVerified,
  onUpdate 
}: TuzemoonButtonProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectPhantomWallet = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom Wallet to continue",
          variant: "destructive",
        });
        return null;
      }

      try {
        const resp = await window.solana.connect();
        return resp.publicKey.toString();
      } catch (err) {
        if (err.code === 4001) {
          toast({
            title: "Connection Rejected",
            description: "Please connect your wallet to continue",
            variant: "destructive",
          });
        }
        return null;
      }
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Phantom wallet",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSignMessage = async (publicKey: string, memeName: string) => {
    try {
      const message = `Sign this message to confirm your Tuzemoon transaction for ${memeName}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        "utf8"
      );
      
      return signedMessage;
    } catch (error) {
      if (error.code === 4001) {
        toast({
          title: "Signature Canceled",
          description: "Transaction canceled by user",
          variant: "destructive",
        });
      } else {
        console.error("Error signing message:", error);
        toast({
          title: "Signature Error",
          description: "Failed to sign the message",
          variant: "destructive",
        });
      }
      return null;
    }
  };

  const handleTuzemoonClick = async () => {
    if (isAdmin) {
      const tuzemoonUntil = isFeatured 
        ? null 
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      try {
        const { error } = await supabase
          .from("Memes")
          .update({ 
            is_featured: !isFeatured,
            tuzemoon_until: tuzemoonUntil
          })
          .eq("id", memeId);

        if (error) throw error;

        void onUpdate();
        
        toast({
          title: isFeatured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
          description: isFeatured 
            ? "The meme has been removed from Tuzemoon" 
            : "The meme has been added to Tuzemoon for 24 hours",
        });
      } catch (error) {
        console.error("Error toggling Tuzemoon status:", error);
        toast({
          title: "Error",
          description: "Failed to update Tuzemoon status",
          variant: "destructive",
        });
      }
    } else if (isVerified) {
      setIsConnecting(true);
      try {
        // Get meme details for the signature message
        const { data: meme, error: memeError } = await supabase
          .from("Memes")
          .select("title")
          .eq("id", memeId)
          .single();

        if (memeError) throw memeError;

        // Connect wallet
        const publicKey = await connectPhantomWallet();
        if (!publicKey) {
          setIsConnecting(false);
          return;
        }

        // Sign message
        const signature = await handleSignMessage(publicKey, meme.title);
        if (!signature) {
          setIsConnecting(false);
          return;
        }

        // If signature successful, show payment modal
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error in Tuzemoon process:", error);
        toast({
          title: "Error",
          description: "Failed to process Tuzemoon request",
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }
    } else {
      toast({
        title: "Verification Required",
        description: "Only verified users can use Tuzemoon",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin && !isVerified) return null;

  return (
    <>
      <Button
        variant="outline"
        onClick={handleTuzemoonClick}
        className={`group ${isFeatured ? 'text-yellow-500' : ''}`}
        disabled={isConnecting}
      >
        <Moon className={`h-5 w-5 mr-2 ${isFeatured ? 'fill-current' : ''}`} />
        {isConnecting ? 'Connecting...' : (isFeatured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon')}
      </Button>

      <TuzemoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};