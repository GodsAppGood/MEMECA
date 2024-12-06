import { useState } from "react";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

const TopMemes = () => {
  const [date, setDate] = useState<Date>();
  const [blockchain, setBlockchain] = useState<string>();

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return storedMemes
        .filter((meme: any) => (meme.likes || 0) > 0)
        .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
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

export default TopMemes;