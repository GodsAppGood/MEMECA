import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import { AppRoutes } from "./config/routes";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "815250406099-noep2rm2svbegg4hpevbenkucu1qhur1.apps.googleusercontent.com";

const AppContent = () => {
  const handleOAuthError = (error: Error) => {
    console.error('Google OAuth script failed to load:', error);
    console.log('OAuth Configuration:', {
      clientId: GOOGLE_CLIENT_ID,
      origin: window.location.origin,
      environment: process.env.NODE_ENV,
      redirectUri: `${window.location.origin}/auth/v1/callback`,
      allowedDomains: [
        'memecatlandar.io',
        'www.memecatlandar.io',
        window.location.hostname
      ]
    });
  };

  return (
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={handleOAuthError}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
              <Routes>
                <AppRoutes />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;