import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const MyStory = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading and handle any potential errors
    const loadContent = async () => {
      try {
        setIsLoading(true);
        // Add a small delay to ensure resources are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content. Please try again.",
        });
        setIsLoading(false);
      }
    };

    loadContent();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-8 text-center">
            My Story
          </h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="mb-6">
              Welcome to Meow Meme Land! This platform was created with a simple vision: 
              to bring together meme enthusiasts and creators in a fun, engaging environment.
            </p>
            
            <p className="mb-6">
              Our journey began with a passion for memes and blockchain technology. 
              We wanted to create a space where creativity meets community, where every 
              meme tells a story, and where creators can share their work with the world.
            </p>

            <p className="mb-6">
              Today, we're proud to offer a platform that celebrates creativity, 
              humor, and the unique culture of the internet. Whether you're here 
              to share your memes, discover new content, or just enjoy the 
              community, we're glad you're part of our story.
            </p>
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;