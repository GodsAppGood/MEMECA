import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSolPayment } from "@/services/phantom-payment";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TuzemoonButtonProps {
  memeId: string;
  memeTitle: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<any>;
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
  const queryClient = useQueryClient();

  const activateTuzemoon = async (userId: string, signature?: string) => {
    try {
      console.log('Starting Tuzemoon activation:', {
        memeId,
        userId,
        signature,
        isAdmin
      });
      
      // Проверяем статус верификации пользователя
      if (!isAdmin) {
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("is_verified")
          .eq("auth_id", userId)
          .single();

        if (userError || !userData?.is_verified) {
          throw new Error("User verification check failed");
        }
      }
      
      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      // Создаем запись о платеже, если есть подпись (платная активация)
      if (signature) {
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
          console.error('Failed to create payment record:', paymentError);
          throw new Error('Failed to record payment');
        }
      }

      // Обновляем статус мема
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: !isFeatured,
          tuzemoon_until: !isFeatured ? tuzemoonUntil : null
        })
        .eq('id', parseInt(memeId));

      if (updateError) {
        console.error('Failed to update meme status:', updateError);
        throw new Error('Failed to activate Tuzemoon status');
      }

      // Проверяем успешность обновления
      const { data: meme, error: verifyError } = await supabase
        .from('Memes')
        .select('is_featured, tuzemoon_until')
        .eq('id', parseInt(memeId))
        .single();

      if (verifyError || !meme) {
        console.error('Verification failed:', { verifyError, meme });
        throw new Error('Failed to verify Tuzemoon activation');
      }

      // Инвалидируем запросы для обновления UI
      await queryClient.invalidateQueries({ queryKey: ['memes'] });
      await queryClient.invalidateQueries({ queryKey: ['meme', memeId] });
      await onUpdate();

      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'activated' : 'deactivated'} Tuzemoon status for this meme`,
      });

      return true;
    } catch (error: any) {
      console.error('Error in activateTuzemoon:', error);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { success, signature, error } = await sendSolPayment(memeId, memeTitle);

      if (!success || !signature) {
        throw new Error(error || "Payment failed");
      }

      const activationSuccess = await activateTuzemoon(user.id, signature);

      if (activationSuccess) {
        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error('Payment/activation error:', error);
      toast({
        title: "Process Failed",
        description: error.message || "Failed to complete the process",
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
        <Rocket className="h-4 w-4" />
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