import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Index from "./pages/Index";
import SubmitMeme from "./pages/SubmitMeme";
import { MemeDetailPage } from "./components/meme/detail/MemeDetailPage";
import TopMemes from "./pages/TopMemes";
import AdminDashboard from "./pages/AdminDashboard";
import MyStory from "./pages/MyStory";
import Dashboard from "./pages/Dashboard";
import MyMemes from "./pages/MyMemes";
import Watchlist from "./pages/Watchlist";
import Tuzemoon from "./pages/Tuzemoon";
import Terms from "./pages/Terms";
import { AdminAuth } from "./components/admin/AdminAuth";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
      setShowAuth(true);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <>
        <AdminAuth 
          isOpen={showAuth} 
          onClose={() => {
            setShowAuth(false);
            if (!isAdmin) {
              window.history.back();
            }
          }} 
        />
        <Navigate to="/" state={{ from: location }} replace />
      </>
    );
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/submit" element={<SubmitMeme />} />
            <Route path="/meme/:id" element={<MemeDetailPage />} />
            <Route path="/top-memes" element={<TopMemes />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route path="/my-story" element={<MyStory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-memes" element={<MyMemes />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/tuzemoon" element={<Tuzemoon />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId="1072222916547-4jbf0rvb3i2qjvv0h8h8a8jd3hf9ckjb.apps.googleusercontent.com">
        <AppContent />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
};

export default App;