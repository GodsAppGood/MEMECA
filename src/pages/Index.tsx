import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TestRunnerComponent } from "@/components/testing/TestRunner";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminButton } from "@/components/admin/AdminButton";
import { useSearchParams } from "react-router-dom";
import { MemeWheelWidget } from "@/components/MemeWheelWidget";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>();
  const [appliedDate, setAppliedDate] = useState<Date>();
  const [appliedBlockchain, setAppliedBlockchain] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize page from URL on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  const handleSearch = () => {
    setAppliedDate(selectedDate);
    setAppliedBlockchain(selectedBlockchain);
    setCurrentPage(1); // Reset to first page when filters change
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
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
      <MemeWheelWidget />
    </MainLayout>
  );
};

export default Index;
