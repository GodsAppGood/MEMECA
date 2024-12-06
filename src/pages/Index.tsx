import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [blockchain, setBlockchain] = useState<string>();

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
          onSearch={() => {}}
        />
        <MemeGrid selectedDate={date} selectedBlockchain={blockchain} />
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Index;