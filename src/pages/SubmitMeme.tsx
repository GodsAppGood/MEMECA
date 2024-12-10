import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { MemeForm } from "@/components/meme/MemeForm";

const SubmitMeme = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-8">Submit Your Meme</h2>
            <MemeForm />
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default SubmitMeme;