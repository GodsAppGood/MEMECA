import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { MemePagination } from "@/components/MemePagination";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminAuth } from "@/components/admin/AdminAuth";

const Index = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>();
  const [appliedDate, setAppliedDate] = useState<Date>();
  const [appliedBlockchain, setAppliedBlockchain] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const handleSearch = () => {
    console.log("Applying filters:", { selectedDate, selectedBlockchain });
    setAppliedDate(selectedDate);
    setAppliedBlockchain(selectedBlockchain);
    setCurrentPage(1);
  };

  const handleAdminAccess = () => {
    console.log("Attempting admin access");
    setShowAdminAuth(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Hero />
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="outline"
            onClick={handleAdminAccess}
            className="mb-4 border-2 border-[#F5A623] hover:bg-[#F5A623]/10"
          >
            <Shield className="mr-2 h-4 w-4" />
            Temporary Admin Access
          </Button>
        </div>
        <Filters
          date={selectedDate}
          setDate={setSelectedDate}
          blockchain={selectedBlockchain}
          setBlockchain={setSelectedBlockchain}
          onSearch={handleSearch}
        />
        <div className="container mx-auto px-4 py-8">
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
        </div>
      </main>
      <Support />
      <Footer />
      <AdminAuth 
        isOpen={showAdminAuth} 
        onClose={() => {
          setShowAdminAuth(false);
          if (localStorage.getItem('isAdmin') === 'true') {
            navigate('/admin');
          }
        }} 
      />
    </div>
  );
};

export default Index;