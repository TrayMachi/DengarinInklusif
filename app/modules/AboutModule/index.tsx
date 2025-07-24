import { Separator } from "~/components/ui/separator";
import { BackgroundSection } from "./sections/BackgroundSection";
import { SolutionSection } from "./sections/SolutionSection";

export const AboutModule = () => {
  return (
    <main className="flex-1">
      <BackgroundSection />
      <Separator className="bg-component-light-border dark:bg-component-dark-border" />
      <SolutionSection />
    </main>
  );
};
