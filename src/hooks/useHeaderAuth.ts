import { useSession } from "./auth/useSession";
import { useAuthActions } from "./auth/useAuthActions";

export const useHeaderAuth = () => {
  const { user, isLoading } = useSession();
  const {
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  } = useAuthActions();

  return {
    user,
    isLoading,
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  };
};