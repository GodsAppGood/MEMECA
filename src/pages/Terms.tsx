import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Welcome to the Private Terms Page</h1>
        <div className="prose prose-invert max-w-none">
          <p>This page contains our privacy policy and terms of service.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;