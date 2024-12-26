import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AdminAuth = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('verify_admin_key' as any, {
        key_to_verify: adminKey
      });

      if (error) throw error;

      if (data) {
        localStorage.setItem('isAdmin', 'true');
        console.log('Admin access granted');
        toast.success("Admin access granted");
        navigate('/admin');
      } else {
        console.log('Invalid admin key');
        toast.error("Invalid admin key");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to verify admin key");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Authentication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};