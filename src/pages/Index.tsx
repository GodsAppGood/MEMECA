import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TestRunnerComponent } from "@/components/testing/TestRunner";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminButton } from "@/components/admin/AdminButton";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>();
  const [appliedDate, setAppliedDate] = useState<Date>();
  const [appliedBlockchain, setAppliedBlockchain] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    setAppliedDate(selectedDate);
    setAppliedBlockchain(selectedBlockchain);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isTestingMode = new URLSearchParams(window.location.search).get('testing') === 'true';

  return (
    <MainLayout>
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
            itemsPerPage={20}
            onPageChange={handlePageChange}
          />
        </ErrorBoundary>
      </div>
      <AdminButton />
    </MainLayout>
  );
};

export default Index;