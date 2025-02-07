
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

interface LoginButtonProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
}

export const LoginButton = ({
  isLoginOpen,
  setIsLoginOpen,
}: LoginButtonProps) => {
  const { login, isAuthenticating } = useAuthSession();

  const handleLogin = async () => {
    const { error } = await login();
    if (error) {
      setIsLoginOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="bg-[#FFB74D] text-black hover:bg-[#EAA347] transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        onClick={() => setIsLoginOpen(true)}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Вход...
          </>
        ) : (
          "Войти"
        )}
      </Button>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Вход через Google</DialogTitle>
            <DialogDescription>
              Мы используем безопасную аутентификацию для защиты ваших данных. Выполняя вход, вы соглашаетесь с нашими{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Политикой конфиденциальности
              </Link>{" "}
              и{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Условиями использования
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            {isAuthenticating ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Подключение...</span>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="w-full bg-[#4285f4] hover:bg-[#357ae8] text-white"
              >
                Войти через Google
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
