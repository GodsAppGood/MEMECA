import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Page imports
import Index from "./pages/Index";
import SubmitMeme from "./pages/SubmitMeme";
import { MemeDetailPage } from "./components/meme/detail/MemeDetailPage";
import TopMemes from "./pages/TopMemes";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import MyStory from "./pages/MyStory";
import Dashboard from "./pages/Dashboard";
import MyMemes from "./pages/MyMemes";
import Watchlist from "./pages/Watchlist";
import Tuzemoon from "./pages/Tuzemoon";
import NotFound from "./pages/NotFound";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "815250406099-noep2rm2svbegg4hpevbenkucu1qhur1.apps.googleusercontent.com";

const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', {
        event,
        timestamp: new Date().toISOString(),
        sessionExists: !!session,
        userId: session?.user?.id,
        origin: window.location.origin,
        environment: import.meta.env.MODE,
        currentPath: window.location.pathname
      });

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Session Ended",
          description: "Your session has ended. Please log in again to continue.",
          variant: "destructive"
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};

const AppContent = () => {
  const handleOAuthError = () => {
    console.error('Google OAuth script failed to load', {
      timestamp: new Date().toISOString(),
      clientId: GOOGLE_CLIENT_ID,
      origin: window.location.origin,
      environment: import.meta.env.MODE,
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
              <SessionHandler />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/submit" element={<SubmitMeme />} />
                <Route path="/meme/:id" element={<MemeDetailPage />} />
                <Route path="/top-memes" element={<TopMemes />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/my-story" element={<MyStory />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-memes" element={<MyMemes />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/tuzemoon" element={<Tuzemoon />} />
                <Route path="*" element={<NotFound />} />
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