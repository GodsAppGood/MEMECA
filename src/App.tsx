import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
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

const App = () => {
  return (
    <React.StrictMode>
      <AppContent />
    </React.StrictMode>
  );
};

export default App;