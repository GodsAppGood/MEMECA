import { useAuthSession } from "./useAuthSession";
import { useAuthStateChange } from "./useAuthStateChange";
import { useAuthActions } from "./useAuthActions";
import { Toaster } from "@/components/ui/toaster";

export const useSession = () => {
  const { user, isLoading, setUser } = useAuthSession();
  useAuthStateChange({ setUser });
  const { handleLogout } = useAuthActions();

  return { 
    user, 
    isLoading, 
    handleLogout 
  };
};