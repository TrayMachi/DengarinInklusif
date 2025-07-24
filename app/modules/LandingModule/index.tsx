import React from "react";
import { Separator } from "~/components/ui/separator";
import { HeroSection } from "./sections/HeroSection";
import { BackgroundSection } from "./sections/BackgroundSection";
import { SolutionSection } from "./sections/SolutionSection";

export const LandingModule = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <Separator className="bg-component-light-border dark:bg-component-dark-border" />
      <BackgroundSection />
      <Separator className="bg-component-light-border dark:bg-component-dark-border" />
      <SolutionSection />
    </main>
  );
};
