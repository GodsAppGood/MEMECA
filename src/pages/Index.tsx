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
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-serif font-bold mb-8">Today's Memes</h2>
          <MemeGrid showTodayOnly={true} />
        </div>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-serif font-bold mb-8">All Memes</h2>
          <MemeGrid selectedDate={date} selectedBlockchain={blockchain} />
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default Index;