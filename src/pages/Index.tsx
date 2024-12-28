import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { MemePagination } from "@/components/MemePagination";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TestRunnerComponent } from "@/utils/testing/TestRunner";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>();
  const [appliedDate, setAppliedDate] = useState<Date>();
  const [appliedBlockchain, setAppliedBlockchain] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    setAppliedDate(selectedDate);
    setAppliedBlockchain(selectedBlockchain);
    setCurrentPage(1);
  };

  const isTestingMode = new URLSearchParams(window.location.search).get('testing') === 'true';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ErrorBoundary>
        <Header />
        <main className="pt-16">
          {isTestingMode && <TestRunnerComponent />}
          <Hero />
          <Filters
            date={selectedDate}
            setDate={setSelectedDate}
            blockchain={selectedBlockchain}
            setBlockchain={setSelectedBlockchain}
            onSearch={handleSearch}
          />
          <div className="container mx-auto px-4 py-8">
            <ErrorBoundary>
              <MemeGrid 
                selectedDate={appliedDate} 
                selectedBlockchain={appliedBlockchain}
                currentPage={currentPage}
                itemsPerPage={100}
              />
              <MemePagination 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </ErrorBoundary>
          </div>
        </main>
        <Support />
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default Index;