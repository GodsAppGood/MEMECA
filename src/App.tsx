import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          if (process.env.NODE_ENV === 'development') {
            const timing = performance.now();
            console.log(`Query execution time: ${timing}ms`);
          }
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
          if (process.env.NODE_ENV === 'development') {
            const timing = performance.now();
            console.log(`Mutation execution time: ${timing}ms`);
          }
        }
      }
    }
  }
});

// Google OAuth client ID configuration with enhanced error handling
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "815250406099-noep2rm2svbegg4hpevbenkucu1qhur1.apps.googleusercontent.com";

const AppContent = () => {
  return (
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={(error) => {
        console.error('Google OAuth script failed to load:', error);
        console.log('OAuth Configuration:', {
          clientId: GOOGLE_CLIENT_ID,
          origin: window.location.origin,
          environment: process.env.NODE_ENV,
          redirectUri: `${window.location.origin}/auth/v1/callback`,
          allowedDomains: [
            'memecatlandar.io',
            'www.memecatlandar.io',
            window.location.hostname // Include current hostname for local development
          ]
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
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
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;
