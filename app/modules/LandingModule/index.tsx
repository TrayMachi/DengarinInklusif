import ApaItuSection from "./sections/ApaItuSection";
import { HeroSection } from "./sections/HeroSection";

export const LandingModule = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <ApaItuSection />
    </main>
  );
};
