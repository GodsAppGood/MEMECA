import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export const Support = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSupportClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Not logged in",
        description: "Please log in to access support",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleSupportClick}
        className="fixed bottom-4 right-4 w-16 h-16 z-50 transition-transform hover:scale-110"
      >
        <img
          src="/lovable-uploads/a9ff8038-20e7-4068-a542-5e51c2a168d8.png"
          alt="24/7 Support"
          className="w-full h-full"
        />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with AI Support</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
            <div className="flex gap-2">
              <div className="bg-[#FFB74D] text-black p-3 rounded-lg max-w-[80%]">
                Hello! How can I help you today? 🐱
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
            />
            <button className="bg-[#FFB74D] text-black px-4 py-2 rounded-md hover:bg-[#FFB74D]/90 transition-colors">
              Send
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};