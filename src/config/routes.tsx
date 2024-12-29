import { Route } from "react-router-dom";
import Index from "../pages/Index";
import SubmitMeme from "../pages/SubmitMeme";
import { MemeDetailPage } from "../components/meme/detail/MemeDetailPage";
import TopMemes from "../pages/TopMemes";
import AdminDashboard from "../pages/AdminDashboard";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import MyStory from "../pages/MyStory";
import Dashboard from "../pages/Dashboard";
import MyMemes from "../pages/MyMemes";
import Watchlist from "../pages/Watchlist";
import Tuzemoon from "../pages/Tuzemoon";

export const AppRoutes = () => (
  <>
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
  </>
);