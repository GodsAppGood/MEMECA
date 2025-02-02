import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { WheelWidget } from "@/components/wheel/WheelWidget";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";

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

  const handleTokenomicsClick = () => {
    toast({
      title: "Tokenomics",
      description: "Welcome to Memeca Tokenomics! 🚀",
    });
  };

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
              <h2 className="text-2xl font-bold mb-4">Welcome to MemeCatLandar! 🚀</h2>
              <p>Hi, I'm Ann Ostrovskya, and I'm absolutely thrilled to have you here! Let me take you behind the scenes of this project—a true labor of love, creativity, and community.</p>
              <p>In today's fast-moving digital world, memes appear and disappear in the blink of an eye. Finding a dedicated space to share your creations, grow a community, and make a lasting impact can feel like an impossible challenge. That's exactly why MemeCatLandar was born—a platform where memes get the spotlight they deserve, and creators have the chance to build their own legacy.</p>
              <p>At the heart of our journey is Memeca—our fearless, toilet-riding space adventurer, navigating the infinite galaxy of memes and bringing creators and audiences together. Here, anyone can design their own meme card, launch their ideas, and connect with the world.</p>
              <h3 className="text-xl font-bold mt-6 mb-4">What Makes MemeCatLandar Special?</h3>
              <p>MemeCatLandar isn't just another platform—it's a launchpad for creativity, a calendar of stories waiting to be told, and a thriving community that celebrates fresh ideas. Whether you're here to explore, create, or simply enjoy the ride, welcome to the future of memes. 🚀</p>
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
            <h3 className="text-2xl font-bold mb-6">Strategic Collaborations & Fundraising</h3>
            <p>At Memeca, we are on the lookout for exciting collaborations that will elevate our ecosystem to new heights. In the first phase, we'll handpick 200 groundbreaking projects, filling our Top 200 leaderboard with the most innovative and influential ideas.</p>
            <p>During this time, we'll also be cultivating a passionate community around Memeca, growing a strong base of users and creators who believe in the vision we're building.</p>
            <p>Through our innovative MemecaWheel initiative, we plan to raise 85 Solana, which will be directly invested into the liquidity pool of our native token. At the same time, we'll explore crowdfunding platforms to secure additional funding for further development and growth.</p>
            <p>To ensure Memeca gains the attention it deserves, we'll kick off global marketing campaigns in partnership with top crypto influencers, generating buzz across the crypto world and growing our project's visibility.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">Next Steps:</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Token Creation & Liquidity Pool – Launching Memeca with liquidity support via Raydium and preparing for our DEX listing.</li>
              <li>Token Update & Marketing on DEX – Ongoing updates and promotion to maximize visibility and expand our community.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">3 Key Strategies for Continued Growth:</h3>
            <ol className="list-decimal ml-6 space-y-4">
              <li>Major Ambassador Partnership – Securing a top-tier ambassador, with a 5% reward from the total token pool, paid out via monthly unlocks over 5 months.</li>
              <li>Token Distribution via Launchpad – Listing Memeca on a major exchange to enhance liquidity and broaden market reach.</li>
              <li>Token Allocation Across Collaborating Projects – Distributing tokens to incentivize Tuzemoon activations and partnerships with our platform.</li>
            </ol>

            <h3 className="text-xl font-bold mt-8 mb-4">MemecatLandar Updates & New Features:</h3>
            <p>We're committed to keeping MemecatLandar on the cutting edge, continuously updating and enhancing our platform. Expect exciting new integrations and features that will bring even more value to our growing user base.</p>
            
            <p className="mt-8">🔮 Memeca is all about pushing boundaries, creating innovative solutions, and building a stronger, more connected community. Join us and be a part of the next evolution of memes! 🚀</p>
          </div>
        </section>

        <section className="mb-20">
          <div className="w-full max-w-4xl mx-auto relative">
            <Button
              onClick={handleTokenomicsClick}
              className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#FFB74D] hover:bg-[#FFB74D] text-black animate-pulse-border px-8 rounded-full"
            >
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              BUY
            </Button>
            <img
              src="/lovable-uploads/81af40a3-5b71-4bf4-8683-e697a727147d.png"
              alt="Tokenomics"
              className="w-full rounded-lg shadow-lg mb-8"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left column */}
              <div className="prose prose-lg">
                <h3 className="text-2xl font-bold mb-4">Memeca Tokenomics</h3>
                <p>Token Name: Memeca</p>
                <p>Total Supply: 1,000,000,000</p>
              </div>
              
              {/* Right column */}
              <div className="prose prose-lg">
                <h3 className="text-2xl font-bold mb-4">Distribution Breakdown:</h3>
                <ul className="list-none p-0">
                  <li>5% for Development</li>
                  <li>5% for Diamond Paws</li>
                  <li>5% for Ambassador, Launchpad, or Collaborating Projects</li>
                  <li>85% will be immediately available for trading on DEX</li>
                </ul>
              </div>
            </div>

            {/* Center aligned bottom text */}
            <div className="text-center prose prose-lg mx-auto">
              <p className="font-bold">LP (Liquidity Pool): Burnt</p>
            </div>
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
