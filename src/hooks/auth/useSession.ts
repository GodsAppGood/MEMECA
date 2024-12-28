import { useAuthSession } from "./useAuthSession";
import { useAuthStateChange } from "./useAuthStateChange";
import { useAuthActions } from "./useAuthActions";

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