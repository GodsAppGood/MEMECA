import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ErrorBoundary>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Support />
        <Footer />
      </ErrorBoundary>
    </div>
  );
};