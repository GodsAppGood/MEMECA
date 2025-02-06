
import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { WheelWidget } from "@/components/wheel/WheelWidget";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const MyStory = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);

  const tokenData = [
    {
      name: "Project Development",
      value: 5,
      color: "#FFE29F",
      tooltip: "Funding for development and scaling of the project."
    },
    {
      name: "Diamond Paws",
      value: 5,
      color: "#FFFFFF",
      tooltip: "Supporting Diamond Paws with 5% from the total token pool, paid monthly over 5 months."
    },
    {
      name: "Growth Strategies",
      value: 5,
      color: "#000000",
      tooltip: "Major Ambassador Partnership: 5% reward paid via monthly unlocks over 5 months.\nToken Distribution via Launchpad: Listing Memeca to enhance liquidity and market reach.\nToken Allocation for Collaborating Projects: Incentivizing Tuzemoon activations and partnerships."
    },
    {
      name: "Raydium LP Burnt",
      value: 85,
      color: "#0EA5E9",
      tooltip: "85% allocated to Raydium LP burnt for liquidity management."
    }
  ];

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 p-4 rounded-lg shadow-lg border border-border">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{data.value}%</p>
          <p className="text-xs mt-2 max-w-[240px] whitespace-pre-line">{data.tooltip}</p>
        </div>
      );
    }
    return null;
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

  const integrationImages = [
    "/lovable-uploads/4ff5644b-eb41-42af-ac82-882c47763c64.png",
    "/lovable-uploads/942521ba-e249-483e-b67b-10beb80c32fe.png",
    "/lovable-uploads/1c266171-6431-4113-8aed-2fa7d0d43211.png",
    "/lovable-uploads/eeefeea6-a694-490c-b900-83fe6d36f484.png",
    "/lovable-uploads/cfdc6767-cc14-47ef-a4df-a577eae2d402.png",
    "/lovable-uploads/f6f55bcd-e39a-410d-a39e-a6f12074bfe1.png",
    "/lovable-uploads/a675557f-4cc3-488f-a946-eae503f2a134.png",
    "/lovable-uploads/28e3ee8c-d9f9-42b0-a40a-b7324240ae81.png",
    "/lovable-uploads/e1ea6e32-6c0e-46f6-a28e-d3685ec60e07.png"
  ];

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
              <p>MemeCatLandar is more than just a platform—it's a Web2.5 hybrid Dapp with elements of decentralized voting, where users shape the top memes through a fair and transparent like system. It's a calendar of meme culture, a launchpad for trends and stories, and an ecosystem for promoting meme projects. Here, creativity meets blockchain technology, opening new opportunities for creators and the community. Welcome to the future of memes! 🚀</p>
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

              <h3 className="text-xl font-semibold mt-6">Telegram Integration</h3>
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
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">Token Distribution</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="w-full lg:w-1/2 h-[400px] p-8 rounded-2xl bg-gradient-to-br from-yellow-100/20 to-yellow-500/10 backdrop-blur-lg border border-yellow-200/30 shadow-2xl">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Raydium LP Burnt", value: 85, color: "#FFB74D" },
                      { name: "Project Development", value: 5, color: "#FFECB3" },
                      { name: "Diamond Paws", value: 5, color: "#FFE082" },
                      { name: "Growth Strategies", value: 5, color: "#FFD54F" }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          className={`${index === activeIndex ? 'font-bold' : ''} fill-yellow-900 text-sm`}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${value}%`}
                        </text>
                      );
                    }}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    paddingAngle={4}
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {({ data }) => data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300"
                        style={{
                          filter: `brightness(${index === activeIndex ? 1.2 : 1}) drop-shadow(0 4px 6px rgba(255, 183, 77, 0.3))`,
                          transform: `scale(${index === activeIndex ? 1.05 : 1}) translateZ(${index * 5}px)`,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <h3 className="text-2xl font-bold mb-4">Token Distribution Strategy</h3>
              <p>Our token distribution strategy is designed to ensure long-term sustainability and value for the Memeca ecosystem:</p>
              <ul>
                <li><strong>85% Raydium LP Burnt:</strong> A significant portion allocated to ensure strong liquidity foundation.</li>
                <li><strong>5% Project Development:</strong> Dedicated to continuous platform improvement and scaling.</li>
                <li><strong>5% Diamond Paws:</strong> Supporting our most loyal community members through structured rewards.</li>
                <li><strong>5% Growth Strategies:</strong> Allocated for partnerships, marketing, and ecosystem expansion.</li>
              </ul>
              <p>This distribution model reflects our commitment to creating a sustainable and growing ecosystem while maintaining strong liquidity support.</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">Integrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {integrationImages.map((src, index) => (
              <div 
                key={src}
                className={`aspect-square flex items-center justify-center p-4 ${
                  (Math.floor(index / 3) + (index % 3)) % 2 === 0 
                    ? 'bg-gray-50' 
                    : 'bg-white'
                } rounded-xl transition-transform duration-300 hover:scale-105`}
              >
                <img
                  src={src}
                  alt={`Integration ${index + 1}`}
                  className="w-24 h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </section>

      </main>
      <Support />
      <WheelWidget />
      <Footer />
    </div>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <path
        d={`M ${cx},${cy} L ${cx + outerRadius},${cy} A ${outerRadius},${outerRadius} 0 0 1 ${cx + Math.cos(endAngle) * outerRadius},${cy + Math.sin(endAngle) * outerRadius} L ${cx},${cy}`}
        fill={fill}
        className="transition-all duration-300 hover:brightness-110"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))',
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </g>
  );
};

export default MyStory;

