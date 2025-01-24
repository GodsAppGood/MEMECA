import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

  console.log('TuzemoonButton render:', {
    isAdmin,
    isVerified,
    isFeatured,
    memeId,
    memeTitle
  });

  // Админская функция активации/деактивации
  const handleAdminActivation = async () => {
    console.log('Admin activation triggered:', {
      memeId,
      currentFeaturedState: isFeatured
    });
    
    setIsProcessing(true);
    try {
      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: !isFeatured,
          tuzemoon_until: !isFeatured ? tuzemoonUntil : null
        })
        .eq('id', parseInt(memeId));

      if (updateError) throw updateError;

      await onUpdate();
      
      console.log('Admin activation successful');
      
      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'activated' : 'deactivated'} Tuzemoon status`,
      });
    } catch (error: any) {
      console.error('Admin activation error:', error);
      toast({
        title: "Activation Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Если админ - показываем только админскую кнопку
  if (isAdmin) {
    console.log('Rendering admin button');
    return (
      <Button
        onClick={handleAdminActivation}
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
    );
  }

  // Если не верифицирован - ничего не показываем
  if (!isVerified) {
    console.log('User not verified, hiding button');
    return null;
  }

  // Проверяем оплату только для верифицированных не-админов
  const { data: hasPayment } = useQuery({
    queryKey: ["tuzemoon-payment", memeId],
    queryFn: async () => {
      console.log('Checking payment status for meme:', memeId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('TuzemoonPayments')
        .select('*')
        .eq('meme_id', parseInt(memeId))
        .eq('user_id', user.id)
        .eq('transaction_status', 'success')
        .single();

      if (error) {
        console.error('Payment check error:', error);
        return false;
      }

      console.log('Payment status:', !!data);
      return !!data;
    },
    enabled: isVerified && !isAdmin
  });

  // Если есть оплата - показываем кнопку активации
  if (hasPayment) {
    console.log('User has payment, showing activation button');
    return (
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={isFeatured ? "secondary" : "default"}
        className="flex items-center gap-2"
        disabled={isProcessing || isFeatured}
      >
        <Rocket className="h-4 w-4" />
        {isFeatured ? "Featured" : "Activate Tuzemoon"}
      </Button>
    );
  }

  // По умолчанию - кнопка для оплаты
  console.log('Showing payment button');
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="default"
        className="flex items-center gap-2"
      >
        <Rocket className="h-4 w-4" />
        Tuzemoon
      </Button>

      <TuzemoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memeTitle={memeTitle}
        memeId={memeId}
      />
    </>
  );
};