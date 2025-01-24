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
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">About Project</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/ecac5159-067f-44d4-aa6a-72be8b1048bf.png"
                alt="Project Features"
                className="w-full max-w-[500px] mx-auto"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>Welcome to the Meme Calendar, a place where creativity, humor, and community come together. Our platform is designed to be simple, honest, and engaging. Here's what makes it special:</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Top 200 Memes</h3>
              <p>The Top 200 is where the best memes shine. It's a dynamic leaderboard showcasing the most-liked memes, selected purely by community votes. This ensures fairness—if people love your meme, it earns its spot in the rankings. Additionally, for those looking to promote their content, we offer a transparent paid feature to highlight sponsored memes, clearly marked to distinguish them from organically popular ones.</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Watchlist</h3>
              <p>The Watchlist is your personal hub for favorite memes. Save the ones you love, revisit them whenever you want, and never lose track of what inspires you. It's a simple tool designed to make your experience smoother and more enjoyable.</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Tuzemoon</h3>
              <p>For those who want to stand out, Tuzemoon is the premium space to showcase exclusive content. Think of it as a VIP stage for memes that deserve a little extra spotlight. Creators who opt for this section can ensure their work reaches an even broader audience.</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">AI-Powered Features (in progress)</h3>
              <p>We're bringing AI into the mix to make your experience even better. Your personal AI assistant will be available to answer questions, provide recommendations, and grow smarter as the platform evolves. This assistant is here to support you and ensure you get the most out of the Meme Calendar.</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Telegram Integration</h3>
              <p>Every meme uploaded to the site is automatically shared in our Telegram channel, making it easy for the community to discuss, share, and connect. It's another way to bring memes to life and extend their reach.</p>
              <p className="mt-4">The Meme Calendar isn't just a site—it's a thriving community where creativity resonates, laughter spreads, and ideas find their audience. Whether you're here to share your creations, discover fresh content, or simply enjoy a good laugh, this is the place for you.</p>
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
