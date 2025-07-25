import { useLoaderData, useFetcher } from "react-router";
import { useState, useRef, useEffect } from "react";
import type { MateriRangkumanLoader } from "./loader";
import { marked } from "marked";

export const MateriRangkumanModule = () => {
  const loaderData = useLoaderData<typeof MateriRangkumanLoader>();
  const fetcher = useFetcher();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const stripMarkdownCodeBlock = (md: string) => {
    return md.replace(/^```markdown/, "").replace(/```$/, "");
  };

  // Function to strip all markdown formatting for TTS
  const stripMarkdownForTTS = (markdown: string) => {
    let text = markdown;

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/`([^`]*)`/g, "$1");

    // Remove headers
    text = text.replace(/^#{1,6}\s+/gm, "");

    // Remove bold and italic
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");
    text = text.replace(/\*(.*?)\*/g, "$1");
    text = text.replace(/__(.*?)__/g, "$1");
    text = text.replace(/_(.*?)_/g, "$1");

    // Remove links
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "");

    // Remove blockquotes
    text = text.replace(/^>\s+/gm, "");

    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, "");
    text = text.replace(/^[\s]*\d+\.\s+/gm, "");

    // Remove horizontal rules
    text = text.replace(/^-{3,}$/gm, "");
    text = text.replace(/^\*{3,}$/gm, "");

    // Clean up extra whitespace
    text = text.replace(/\n{3,}/g, "\n\n");
    text = text.trim();

    return text;
  };

  const handlePlayTTS = async () => {
    if (isPlaying) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const cleanText = stripMarkdownForTTS(
        stripMarkdownCodeBlock(loaderData?.materialContent?.content ?? "")
      );

      const formData = new FormData();
      formData.append("text", cleanText);
      formData.append("intent", "generate-tts");

      fetcher.submit(formData, {
        method: "POST",
        encType: "multipart/form-data",
      });
    } catch (error) {
      console.error("Error generating TTS:", error);
      setIsLoading(false);
    }
  };

  // Handle TTS response
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle" && isLoading) {
      const audio = audioRef.current;
      if (audio && fetcher.data.success && fetcher.data.audioData) {
        try {
          // Convert base64 to blob and create URL
          const audioBytes = atob(fetcher.data.audioData);
          const audioArray = new Uint8Array(audioBytes.length);
          for (let i = 0; i < audioBytes.length; i++) {
            audioArray[i] = audioBytes.charCodeAt(i);
          }
          const audioBlob = new Blob([audioArray], {
            type: fetcher.data.mimeType,
          });
          const audioUrl = URL.createObjectURL(audioBlob);

          audio.src = audioUrl;
          audio.play();
          setIsPlaying(true);
          setIsLoading(false);

          audio.onended = () => {
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl); // Clean up blob URL
          };

          audio.onerror = () => {
            setIsPlaying(false);
            setIsLoading(false);
            URL.revokeObjectURL(audioUrl); // Clean up on error
          };
        } catch (error) {
          console.error("Error processing audio data:", error);
          setIsPlaying(false);
          setIsLoading(false);
        }
      } else if (fetcher.data && !fetcher.data.success) {
        // Handle error responses
        console.error("TTS Error:", fetcher.data);
        setIsLoading(false);
      }
    }
  }, [fetcher.data, fetcher.state, isLoading]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="relative mb-12">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl blur-3xl transform -rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-chart-1/10 via-chart-2/10 to-chart-3/10 rounded-3xl blur-2xl transform rotate-1"></div>

          {/* Header content */}
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
            <div className="flex max-md:flex-col items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-primary to-chart-3 rounded-full"></div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Rangkuman Materi
                </h1>
              </div>

              {/* TTS Control Button */}
              <button
                onClick={handlePlayTTS}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isPlaying ? "Stop audio" : "Play audio"}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="text-sm font-medium text-primary">
                  {isLoading ? "Generating..." : isPlaying ? "Stop" : "Listen"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <p className="text-lg text-muted-foreground">
                Rangkuman materi dari{" "}
                <span className="font-semibold text-primary">
                  {loaderData?.title}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          {/* Content card */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Content header with gradient */}
            <div className="h-1 bg-gradient-to-r from-primary via-chart-1 to-chart-3"></div>

            {/* Main content */}
            <div className="p-8 lg:p-12">
              <div
                className="prose lg:prose-xl prose-zinc dark:prose-invert 
                          prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tight
                          prose-headings:mt-8 prose-headings:mb-4 prose-headings:first:mt-0
                          prose-headings:leading-tight prose-headings:scroll-mt-24
                          prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
                          prose-a:text-primary prose-a:font-medium prose-a:no-underline 
                          prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-em:text-muted-foreground prose-em:font-medium
                          prose-code:text-accent-foreground prose-code:bg-accent/20 
                          prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono
                          prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                          prose-blockquote:border-l-4 prose-blockquote:border-primary/50 
                          prose-blockquote:bg-secondary/20 prose-blockquote:rounded-r-lg prose-blockquote:py-4
                          prose-ul:space-y-2 prose-ol:space-y-2
                          prose-li:text-foreground/90 prose-li:leading-relaxed
                          prose-hr:border-border/30 prose-hr:my-12
                          prose-table:border-collapse prose-table:border prose-table:border-border/50 prose-table:rounded-lg
                          prose-th:bg-muted/50 prose-th:border prose-th:border-border/50 prose-th:px-4 prose-th:py-3
                          prose-td:border prose-td:border-border/50 prose-td:px-4 prose-td:py-3
                          w-full max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(
                    stripMarkdownCodeBlock(
                      loaderData?.materialContent?.content ?? ""
                    )
                  ),
                }}
              ></div>
            </div>
          </div>

          {/* Decorative bottom elements */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-chart-1/20 to-chart-3/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg"></div>
        </div>

        {/* Bottom spacing */}
        <div className="h-24"></div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </main>
  );
};
