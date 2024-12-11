import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const MyStory = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
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
        <section className="mb-20">
          <h1 className="text-4xl font-bold font-serif mb-12 text-center">My Story</h1>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/718ee44f-c209-41ff-aa4c-3a6fa2a24df8.png"
                alt="Project Illustration"
                className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>My name is Ann Ostrovsky, and I am thrilled to welcome you here. Today, I want to share something special with you—my project that was created with immense love and enthusiasm. It is a meme calendar, and I have poured my heart into it.</p>
              <p>Memes have become an integral part of our digital lives, but with each passing day, their volume grows so much that it's hard to keep up with them before they fade away. I noticed this issue and decided to offer a solution: a space where anyone planning to launch their meme can share it, gain support, and build their first audience.</p>
              <p>My project is an opportunity for new ideas to be heard, for memes to become true stories, and for people to become part of something greater. Here, everyone can explore memes, show their support, and help them rise. You will find simplicity, structure, and openness here, which are so needed in today's chaotic information world.</p>
              <p>When I conceptualized this calendar idea, I began imagining how I would like to see such an application. And now, this dream has become a reality and is available to all of you! I am incredibly grateful to everyone who chooses to use this platform. I'm confident it will bring immense value to both the crypto community and those who follow meme trends. People will better understand new projects, and projects will have the chance to share their story and become popular.</p>
              <p>Thank you for being here. Let's create meme history together!</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">About Project</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/fe4a6b50-511b-47ff-8a83-ced443561ccb.png"
                alt="Project Features"
                className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>My site combines simplicity and honesty. If people like your memes, they automatically appear in the "Top Memes" section. This is a space for those who don't want to spend much time searching—it's easy to find what most people already enjoy. This category will also feature memes promoted on a paid basis (such memes will be specially marked to distinguish them from organically liked ones).</p>
              <p>I plan to integrate AI technologies so that your personal AI assistant is always there. This assistant will grow smarter and evolve alongside the project, quickly adapting to your needs and questions. All memes uploaded to the site are automatically duplicated to my Telegram channel, where they can also be discussed and shared in a chat.</p>
              <p>Thus, the "Meme Calendar" project is not just a platform for posting memes. It's a community, an opportunity for memes to become favorites, for ideas to find their resonance, and for you to gain support and access to bright, creative stories. Let's dive into the world of memes together!</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <section>
            <h2 className="text-3xl font-bold font-serif mb-8">TuzeMoon RoadMap</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>Launching own token on the PumpFun platform (Initial investment: 10 Solana)</li>
              <li>Application development: updates, design, and improvements</li>
              <li>Integration of AI technologies</li>
              <li>Full autonomy of the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold font-serif mb-8">Targets</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>Value to the crypto community</li>
              <li>Building a dedicated community</li>
              <li>Trading launch on DEX</li>
              <li>$1 million capitalization</li>
              <li>$10 million capitalization</li>
            </ul>
          </section>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;