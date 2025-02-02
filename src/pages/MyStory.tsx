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
          <h1 className="text-4xl font-bold font-serif mb-12 text-center">My Story</h1>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/687016b8-6c47-4357-9f3f-b4af5d2da3a7.png"
                alt="Project Illustration"
                className="w-full max-w-[500px] mx-auto"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>Hi, my name is Ann Ostrovsky, and I am absolutely delighted to have you here! Let me share the story behind this project—a labor of love, creativity, and community.</p>
              <p>In today's fast-paced digital world, memes are everywhere, but they fade as quickly as they rise. Finding the right space to share a meme, grow a community, and leave a lasting impact can feel like an impossible mission. That's where MemeCatLandar comes in—a unique platform where memes are given the spotlight they deserve, and creators can build their legacy.</p>
              <p>Guided by Memeca, our fearless, toilet-riding space adventurer, this platform travels across the infinite galaxy of memes, bringing together creators and audiences. Here, everyone has the opportunity to craft their own meme card, launch their ideas, and connect with the world.</p>
              <p>What makes MemeCatLandar special? It's not just a platform—it's a launchpad for creativity, a calendar for stories waiting to be told, and a community that champions new ideas. Whether you're here to explore, support, or create, you're part of something bigger.</p>
              <p>When I first dreamed of this project, I envisioned a space that was simple yet powerful, structured yet open. Now that dream has come to life, and it's all for you. I'm truly grateful for each and every person who joins this journey. Together, we can make memes more than fleeting jokes; we can turn them into stories, trends, and cultural milestones.</p>
              <p>Thank you for being here. Let's create, connect, and make meme history—one card at a time.</p>
              <p>With love, Ann Ostrovsky</p>
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
              <h1 className="text-2xl font-bold mb-6">MemeCatLandar – The World's First AI-Powered Meme Calendar</h1>
              
              <p>MemeCalendar is a fully automated, AI-driven MVP, designed to evolve and improve with each update. More than just a calendar, it's an intelligent ecosystem where humor, technology, and community come together. Our platform offers a seamless way to track, save, and discover the best memes, adapting to trends and keeping you ahead of the curve.</p>

              <h3 className="text-xl font-semibold mt-6">Top 200 Memes</h3>
              <p>The Top 200 leaderboard is where the best memes rise to the top, ranked solely by community votes. This ensures complete fairness—if people love your meme, it earns its place. For those looking to boost their content, we offer a transparent paid feature to highlight sponsored memes, which are clearly marked to differentiate them from organically popular ones.</p>

              <h3 className="text-xl font-semibold mt-6">Watchlist (In Progress)</h3>
              <p>The Watchlist is your personal hub for saving and revisiting your favorite memes. Never lose track of what inspires you—store your top picks and access them anytime, all in one place.</p>
              <p>🚀 MemeCatLandar is just getting started—stay tuned for more innovations!</p>

              <h3 className="text-xl font-semibold mt-6">Tuzemoon Activation (24 Hours)</h3>
              <p>Unlock the Tuzemoon boost and make your meme stand out! This premium feature, powered by Phantom Wallet integration, lets you promote your meme for 0.1 SOL and gives it 24 hours of maximum visibility.</p>
              <p>🔥 What you get with Tuzemoon:</p>
              <ul>
                <li>Animated highlight – your meme catches the eye like never before.</li>
                <li>Exclusive "HOT" badge – instantly signaling top-tier content.</li>
                <li>Priority placement in the Tuzemoon section – the VIP stage for trending memes.</li>
              </ul>
              <p>🚀 Elevate your meme game and grab the attention you deserve!</p>

              <h3 className="text-xl font-semibold mt-6">MemecAI Analyze (BETA)</h3>
              <p>Meet MemecAI, our built-in AI designed to analyze memes and provide insightful evaluations to help you make informed decisions. Whether you're looking for feedback or just curious about how your meme ranks, MemecAI is here to assist!</p>
              <p>💡 Key Features:</p>
              <ul>
                <li>AI-Powered Meme Analysis – get a smart evaluation of your meme based on various factors.</li>
                <li>Integrated ChatGPT Window – engage in real-time conversations, ask questions, and get instant responses.</li>
                <li>Constantly Improving – as the platform evolves, MemecAI will become even smarter and more accurate.</li>
              </ul>
              <p>🚀 This is just the beginning – we're committed to making these features even better over time!</p>

              <h3 className="text-xl font-semibold mt-6">Telegram Integration (In Progress)</h3>
              <p>Seamlessly extend your meme's reach with our Telegram integration! Every meme uploaded to the platform is instantly shared in our official Telegram channel, sparking discussions, shares, and deeper community engagement.</p>
              <p>💬 Why it matters?</p>
              <ul>
                <li>Instant exposure – your meme gets seen beyond the platform.</li>
                <li>Community-driven engagement – connect, react, and go viral.</li>
                <li>Effortless sharing – memes come to life where conversations happen.</li>
              </ul>
              <p>🚀 More reach, more impact – your memes deserve the spotlight!</p>

              <h3 className="text-xl font-semibold mt-6">Memecawheel.xyz – Secure Your Spot in Meme History!</h3>
              <p>Introducing Memecawheel.xyz, an exclusive platform that lets early adopters amplify their memes through MemeWidget. By integrating with Phantom Wallet, users can seamlessly initiate a transaction on the Solana network, permanently securing their meme's place and visibility.</p>
              <p>🔥 Why Memecawheel?</p>
              <ul>
                <li>One-time transaction – lock in your spot forever.</li>
                <li>Guaranteed exposure – your meme gets a dedicated place & time.</li>
                <li>Future NFT integration – soon, you'll receive a free NFT as proof of ownership, allowing you to trade or sell your spot to others!</li>
              </ul>
              <p>🚀 Get in early and claim your space before it’s gone!</p>
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
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">Tuzemoon Roadmap</h2>
          <div className="prose prose-lg max-w-4xl mx-auto">
            <ol className="list-decimal space-y-6">
              <li className="font-semibold">
                Strategic Collaborations and Fundraising
                <p className="font-normal mt-2">
                  We plan to establish strategic partnerships with other projects to enhance the ecosystem and create mutually beneficial opportunities. Additionally, we will raise funds to bolster the liquidity pool through:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Additional fundraising rounds focused on expanding liquidity and project stability.</li>
                  <li>MemecaWheel fundraising campaign, where 100% of the collected funds will directly support the liquidity pool.</li>
                </ul>
              </li>
              <li className="font-semibold">
                Listing on Dexscreener
                <p className="font-normal mt-2">
                  Immediately following the token launch, Tuzemoon will be listed on Dexscreener. With liquidity pool support in place, investors will be able to effortlessly track price movements and trading volumes.
                </p>
              </li>
              <li className="font-semibold">
                Regular Platform Updates
                <p className="font-normal mt-2">
                  Our commitment to innovation and usability will be reflected in regular platform updates. These updates will focus on enhancing:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Functionality for a smoother user experience.</li>
                  <li>Design improvements to ensure an intuitive and visually appealing interface.</li>
                  <li>Features that provide added value to all platform users.</li>
                </ul>
              </li>
              <li className="font-semibold">
                AI Assistant Integration
                <p className="font-normal mt-2">
                  We aim to integrate a powerful AI assistant into the Tuzemoon ecosystem. This assistant will:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Analyze tokens and offer detailed insights into their potential and performance.</li>
                  <li>Evaluate new blockchain projects and provide assessments for investors.</li>
                  <li>Deliver personalized trading recommendations and guidance for portfolio management.</li>
                </ul>
              </li>
              <li className="font-semibold">
                Fully Automated Platform
                <p className="font-normal mt-2">
                  Looking ahead, our ultimate goal is to transform the platform into a fully automated system. This will ensure:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>A seamless and efficient user experience.</li>
                  <li>Reduced manual intervention for core processes.</li>
                  <li>Enhanced scalability to support our growing community.</li>
                </ul>
              </li>
            </ol>
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
