import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const SolutionSection = () => {
  return (
    <section id="solution" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Accessibility-First Solution
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-[600px] mx-auto">
            How Dengar Inklusif addresses educational accessibility challenges
            through innovative technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Voice navigation"
                >
                  🎙️
                </span>
              </div>
              <CardTitle>Voice-First Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete keyboard and screen reader optimization with intuitive
                voice commands for seamless navigation through learning content.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Document conversion"
                >
                  📄
                </span>
              </div>
              <CardTitle>Document-to-Audio Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced TTS technology converts PDFs, images, and printed
                materials into high-quality audio with natural speech patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Audio lessons"
                >
                  🎧
                </span>
              </div>
              <CardTitle>Interactive Audio Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Curriculum-aligned audio content with voice exercises and
                interactive elements designed specifically for grades SD through
                SMA.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Technology stack"
                >
                  ⚙️
                </span>
                Built with Modern, Accessible Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    Frontend & User Experience
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React Router v7</Badge>
                    <Badge variant="secondary">Shadcn/ui</Badge>
                    <Badge variant="secondary">TailwindCSS</Badge>
                    <Badge variant="secondary">ARIA Standards</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Backend & AI Services</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Supabase</Badge>
                    <Badge variant="secondary">Google Cloud TTS</Badge>
                    <Badge variant="secondary">Whisper AI</Badge>
                    <Badge variant="secondary">OCR Technology</Badge>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Every component is designed with accessibility as a priority,
                ensuring compatibility with screen readers, keyboard navigation,
                and assistive technologies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
