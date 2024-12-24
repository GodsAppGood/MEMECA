import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { WelcomeSection } from "@/components/my-story/WelcomeSection";
import { AboutSection } from "@/components/my-story/AboutSection";
import { RoadmapSection } from "@/components/my-story/RoadmapSection";
import { LoadingState } from "@/components/my-story/LoadingState";
import { useLoadingState } from "@/hooks/useLoadingState";

const MyStory = () => {
  const { isLoading } = useLoadingState();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <WelcomeSection />
        <AboutSection />
        <RoadmapSection />
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;