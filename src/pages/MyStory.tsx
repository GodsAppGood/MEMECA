import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { WelcomeSection } from "@/components/my-story/WelcomeSection";
import { ProjectFeatures } from "@/components/my-story/ProjectFeatures";
import { AboutProject } from "@/components/my-story/AboutProject";
import { RoadmapSection } from "@/components/my-story/RoadmapSection";

const MyStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <WelcomeSection />
        <ProjectFeatures />
        <AboutProject />
        <RoadmapSection />
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;