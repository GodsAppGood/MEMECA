import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { TuzemoonModal } from "./TuzemoonModal";
import { connectPhantomWallet, signMessage } from "@/utils/phantom-wallet";
import { updateTuzemoonStatus } from "@/services/tuzemoon-service";

interface TuzemoonButtonProps {
  memeId: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<void>;
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

  const handleSuccess = async () => {
    try {
      const result = await updateTuzemoonStatus(memeId, false);
      if (result) {
        void onUpdate();
      }
    } catch (error) {
      console.error("Error in handleSuccess:", error);
    }
  };

  const handleTuzemoonClick = async () => {
    if (isAdmin) {
      const result = await updateTuzemoonStatus(memeId, isFeatured);
      if (result) {
        void onUpdate();
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
        const message = `Sign this message to confirm your Tuzemoon transaction for ${meme.title}`;
        const signature = await signMessage(message);
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