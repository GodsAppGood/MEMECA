import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export const AdminButton = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isLoading || !isAdmin) return null;

  const handleAdminAccess = () => {
    navigate('/admin');
    toast({
      title: "Welcome to Admin Dashboard",
      description: "You have accessed the admin area.",
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={handleAdminAccess}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
      >
        <Shield className="w-4 h-4" />
        Admin Dashboard
      </Button>
    </div>
  );
};