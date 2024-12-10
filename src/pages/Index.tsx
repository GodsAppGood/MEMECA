import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { MemePagination } from "@/components/MemePagination";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [blockchain, setBlockchain] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Hero />
        <Filters
          date={date}
          setDate={setDate}
          blockchain={blockchain}
          setBlockchain={setBlockchain}
          onSearch={() => setCurrentPage(1)}
        />
        <div className="container mx-auto px-4 py-8">
          <MemeGrid 
            selectedDate={date} 
            selectedBlockchain={blockchain}
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
    </div>
  );
};

export default Index;