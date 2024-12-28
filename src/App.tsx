import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import SubmitMeme from "./pages/SubmitMeme";
import MyMemes from "./pages/MyMemes";
import MemeDetail from "./pages/MemeDetail";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import MyStory from "./pages/MyStory";
import ReferralProgram from "./pages/ReferralProgram";
import Watchlist from "./pages/Watchlist";
import TopMemes from "./pages/TopMemes";
import Tuzemoon from "./pages/Tuzemoon";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="815250406099-noep2rm2svbegg4hpevbenkucu1qhur1.apps.googleusercontent.com">
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<SubmitMeme />} />
              <Route path="/my-memes" element={<MyMemes />} />
              <Route path="/meme/:id" element={<MemeDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-story" element={<MyStory />} />
              <Route path="/referral" element={<ReferralProgram />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/top-memes" element={<TopMemes />} />
              <Route path="/tuzemoon" element={<Tuzemoon />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default AppContent;