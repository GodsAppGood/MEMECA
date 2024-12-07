import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const MyStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-center text-[36px] font-bold font-serif">Hello</h1>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;