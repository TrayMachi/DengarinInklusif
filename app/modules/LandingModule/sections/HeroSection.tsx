import React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="secondary" className="px-4 py-2">
            🎧 Audio-First Learning Platform
          </Badge>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Personalized Learning for
              <br />
              Visually Impaired Students
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Empowering blind and visually impaired students in Indonesia with
              audio-based lessons, voice exercises, and document-to-speech
              conversion designed for grades SD through SMA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="flex items-center gap-8 text-sm text-muted-foreground mt-8">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl"
                role="img"
                aria-label="Accessibility icon"
              >
                ♿
              </span>
              <span>Screen Reader Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Voice icon">
                🎙️
              </span>
              <span>Voice Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Education icon">
                📚
              </span>
              <span>Curriculum Aligned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
