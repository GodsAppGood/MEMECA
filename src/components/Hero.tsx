import { HeroVideo } from "./hero/HeroVideo";
import { HeroContent } from "./hero/HeroContent";

export const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <HeroVideo />
      <HeroContent />
    </div>
  );
};