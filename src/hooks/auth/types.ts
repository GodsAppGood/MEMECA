export interface User {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  picture?: string;
  profile_image?: string;
  isAdmin?: boolean;
  is_admin?: boolean;
  email_confirmed?: boolean;
  created_at?: string;
  is_verified?: boolean;
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