import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Index from "./pages/Index";
import SubmitMeme from "./pages/SubmitMeme";
import MemeDetail from "./pages/MemeDetail";
import TopMemes from "./pages/TopMemes";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import MyStory from "./pages/MyStory";
import Dashboard from "./pages/Dashboard";
import MyMemes from "./pages/MyMemes";
import Watchlist from "./pages/Watchlist";
import ReferralProgram from "./pages/ReferralProgram";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="815250406099-4l39oo62a19gcpihekksnrn37bo7jpcr.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/submit" element={<SubmitMeme />} />
            <Route path="/meme/:id" element={<MemeDetail />} />
            <Route path="/top-memes" element={<TopMemes />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/my-story" element={<MyStory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-memes" element={<MyMemes />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/referral-program" element={<ReferralProgram />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;