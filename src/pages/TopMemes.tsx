import { useState } from "react";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { MemeGrid } from "@/components/MemeGrid";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const TopMemes = () => {
  const [date, setDate] = useState<Date>();
  const [blockchain, setBlockchain] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return storedMemes
        .filter((meme: any) => (meme.likes || 0) > 0)
        .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 200);
    },
  });

  const filteredMemes = memes.filter((meme: any) => {
    const matchesSearch = searchTerm
      ? meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meme.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Filters
            date={date}
            setDate={setDate}
            blockchain={blockchain}
            setBlockchain={setBlockchain}
            onSearch={() => {}}
          />
          <MemeGrid selectedDate={date} selectedBlockchain={blockchain} />
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default TopMemes;