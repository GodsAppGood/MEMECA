import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import NotFound from "./pages/404";
import ServerError from "./pages/500";
import Home from "./pages/Home";
import MyMemes from "./pages/MyMemes";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Tuzemoon from "./pages/Tuzemoon";
import Watchlist from "./pages/Watchlist";
import TopMemes from "./pages/TopMemes";
import MyStory from "./pages/MyStory";
import { useToast } from "./components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (isAuthenticated === null) {
    return null; // or loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/my-memes" 
            element={
              <ProtectedRoute>
                <MyMemes />
              </ProtectedRoute>
            } 
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tuzemoon" element={<Tuzemoon />} />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
          <Route path="/top-memes" element={<TopMemes />} />
          <Route path="/my-story" element={<MyStory />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;