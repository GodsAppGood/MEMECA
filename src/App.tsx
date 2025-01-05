import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SolanaProvider } from "./components/providers/SolanaProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Routes, Route } from "react-router-dom";
import MemeDetail from "@/pages/MemeDetail";
import { Tuzemoon } from "@/components/dashboard/Tuzemoon";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Tuzemoon />} />
              <Route path="/meme/:id" element={<MemeDetail />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </SolanaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;