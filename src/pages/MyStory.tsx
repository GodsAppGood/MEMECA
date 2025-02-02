import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { WheelWidget } from "@/components/wheel/WheelWidget";

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
          <h1 className="text-4xl font-bold font-serif mb-12 text-center">MemeCatLandar – The World's First AI-Powered Meme Calendar</h1>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/687016b8-6c47-4357-9f3f-b4af5d2da3a7.png"
                alt="Project Illustration"
                className="w-full max-w-[500px] mx-auto"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>MemeCalendar is a fully automated, AI-driven MVP, designed to evolve and improve with each update. More than just a calendar, it's an intelligent ecosystem where humor, technology, and community come together. Our platform offers a seamless way to track, save, and discover the best memes, adapting to trends and keeping you ahead of the curve.</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">Project Features</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/ecac5159-067f-44d4-aa6a-72be8b1048bf.png"
                alt="Project Features"
                className="w-full max-w-[500px] mx-auto"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <h3 className="text-xl font-semibold mt-4 mb-2">Top 200 Memes</h3>
              <p>The Top 200 leaderboard is where the best memes rise to the top, ranked solely by community votes. This ensures complete fairness—if people love your meme, it earns its place. For those looking to boost their content, we offer a transparent paid feature to highlight sponsored memes, which are clearly marked to differentiate them from organically popular ones.</p>

              <h3 className="text-xl font-semibold mt-4 mb-2">Watchlist (In Progress)</h3>
              <p>The Watchlist is your personal hub for saving and revisiting your favorite memes. Never lose track of what inspires you—store your top picks and access them anytime, all in one place.</p>
              <p className="text-primary">🚀 MemeCatLandar is just getting started—stay tuned for more innovations!</p>

              <h3 className="text-xl font-semibold mt-4 mb-2">Tuzemoon Activation (24 Hours)</h3>
              <p>Unlock the Tuzemoon boost and make your meme stand out! This premium feature, powered by Phantom Wallet integration, lets you promote your meme for 0.1 SOL and gives it 24 hours of maximum visibility.</p>
              <p className="text-primary">🔥 What you get with Tuzemoon:</p>
              <ul className="list-disc ml-6">
                <li>Animated highlight – your meme catches the eye like never before.</li>
                <li>Exclusive "HOT" badge – instantly signaling top-tier content.</li>
                <li>Priority placement in the Tuzemoon section – the VIP stage for trending memes.</li>
              </ul>
              <p className="text-primary">🚀 Elevate your meme game and grab the attention you deserve!</p>

              <h3 className="text-xl font-semibold mt-4 mb-2">MemecAI Analyze (BETA)</h3>
              <p>Meet MemecAI, our built-in AI designed to analyze memes and provide insightful evaluations to help you make informed decisions. Whether you're looking for feedback or just curious about how your meme ranks, MemecAI is here to assist!</p>
              <p className="text-primary">💡 Key Features:</p>
              <ul className="list-disc ml-6">
                <li>AI-Powered Meme Analysis – get a smart evaluation of your meme based on various factors.</li>
                <li>Integrated ChatGPT Window – engage in real-time conversations, ask questions, and get instant responses.</li>
                <li>Constantly Improving – as the platform evolves, MemecAI will become even smarter and more accurate.</li>
              </ul>
              <p className="text-primary">🚀 This is just the beginning – we're committed to making these features even better over time!</p>

              <h3 className="text-xl font-semibold mt-4 mb-2">Telegram Integration (In Progress)</h3>
              <p>Seamlessly extend your meme's reach with our Telegram integration! Every meme uploaded to the platform is instantly shared in our official Telegram channel, sparking discussions, shares, and deeper community engagement.</p>
              <p className="text-primary">💬 Why it matters?</p>
              <ul className="list-disc ml-6">
                <li>Instant exposure – your meme gets seen beyond the platform.</li>
                <li>Community-driven engagement – connect, react, and go viral.</li>
                <li>Effortless sharing – memes come to life where conversations happen.</li>
              </ul>
              <p className="text-primary">🚀 More reach, more impact – your memes deserve the spotlight!</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="w-full">
            <img
              src="/lovable-uploads/7debb387-0e04-4871-9395-44b1a2502a40.png"
              alt="Memeca Banner"
              className="w-full"
            />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">Memecawheel.xyz</h2>
          <div className="prose prose-lg max-w-4xl mx-auto">
            <p>Introducing Memecawheel.xyz, an exclusive platform that lets early adopters amplify their memes through MemeWidget. By integrating with Phantom Wallet, users can seamlessly initiate a transaction on the Solana network, permanently securing their meme's place and visibility.</p>
            <p className="text-primary">🔥 Why Memecawheel?</p>
            <ul className="list-disc ml-6">
              <li>One-time transaction – lock in your spot forever.</li>
              <li>Guaranteed exposure – your meme gets a dedicated place & time.</li>
              <li>Future NFT integration – soon, you'll receive a free NFT as proof of ownership, allowing you to trade or sell your spot to others!</li>
            </ul>
            <p className="text-primary">🚀 Get in early and claim your space before it's gone!</p>
          </div>
        </section>
      </main>
      <Support />
      <WheelWidget />
      <Footer />
    </div>
  );
};

export default MyStory;