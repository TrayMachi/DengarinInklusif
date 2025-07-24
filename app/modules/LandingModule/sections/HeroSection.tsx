import React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FileText, GraduationCap, Mic, Scan } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="px-6 py-3 text-xl font-bold">
            Audio-First Learning Platform
          </Badge>
          <div className="space-y-8 py-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Personalized Learning for
              <br />
              Visually Impaired Students
            </h1>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Accessibility icon"
                >
                  <FileText />
                </span>
                <span>Screen Reader Optimized</span>
              </div>
              <div className="flex items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span className="text-2xl" role="img" aria-label="Voice icon">
                  <Mic />
                </span>
                <span>Voice Navigation</span>
              </div>
              <div className="flex items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Education icon"
                >
                  <GraduationCap />
                </span>
                <span>Curriculum Aligned</span>
              </div>
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Empowering blind and visually impaired students in Indonesia with
              audio-based lessons, voice exercises, and document-to-speech
              conversion designed for grades SD through SMA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 py-2">
            <Button size="lg" className="h-12 px-8">
              Start Learning
              <span className="sr-only">
                Begin your accessible learning journey
              </span>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8">
              Watch Demo
              <span className="sr-only">View platform demonstration</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
