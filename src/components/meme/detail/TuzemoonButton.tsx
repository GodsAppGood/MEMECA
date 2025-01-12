import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { TuzemoonModal } from "./TuzemoonModal";
import { updateTuzemoonStatus } from "@/services/tuzemoon-service";

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
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast({
        title: "Feature Unavailable",
        description: "Tuzemoon feature is being updated",
        variant: "destructive",
      });
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
      >
        <Moon className={`h-5 w-5 mr-2 ${isFeatured ? 'fill-current' : ''}`} />
        {isFeatured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
      </Button>

      <TuzemoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        memeId={memeId}
        memeTitle={memeTitle}
      />
    </>
  );
};