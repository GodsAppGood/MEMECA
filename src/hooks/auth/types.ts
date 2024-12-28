export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLoginSuccess: (response: any) => void;
  handleLoginError: () => void;
  handleLogout: () => void;
}