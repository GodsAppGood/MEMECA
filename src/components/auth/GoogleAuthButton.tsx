import { GoogleLogin } from "@react-oauth/google";

interface GoogleAuthButtonProps {
  onSuccess: (response: any) => void;
  onError: () => void;
}

export const GoogleAuthButton = ({ onSuccess, onError }: GoogleAuthButtonProps) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap
      theme="filled_black"
      shape="pill"
      size="large"
      text="continue_with"
      locale="en"
    />
  );
};