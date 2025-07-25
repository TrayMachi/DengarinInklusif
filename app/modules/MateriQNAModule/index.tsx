import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Mic, MicOff, Send, Loader2, Bot, User } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  isLoading?: boolean;
}

export const MateriQNAModule = () => {
  const { material, userQuestions } = useLoaderData<{
    material: any;
    userQuestions: any[];
  }>();
  const fetcher = useFetcher();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const processMarkdown = (text: string) => {
    let processed = text.replace(/\*\*(.*?)\*\*/g, "<em>$1</em>");

    processed = processed.replace(
      /\*(.*?)\*/g,
      '<span class="font-semibold">$1</span>'
    );
    return processed;
  };

  useEffect(() => {
    if (userQuestions) {
      const formattedMessages = userQuestions.map((qa, index) => ({
        id: `${qa.id || index}`,
        question: qa.question,
        answer: qa.answer,
        createdAt: new Date(qa.createdAt),
      }));
      setMessages(formattedMessages);
    }
  }, [userQuestions]);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data
    ) {
      if (fetcher.data.success) {
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
        setQuestion("");
      } else {
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || fetcher.state === "submitting") return;

    const tempMessage: ChatMessage = {
      id: "temp-" + Date.now(),
      question: question,
      answer: "",
      createdAt: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, tempMessage]);

    const formData = new FormData();
    formData.append("question", question);
    fetcher.submit(formData, { method: "POST" });
  };

  if (!material) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-xl mx-auto p-8 text-center">
          <CardHeader>
            <CardTitle>Materi tidak ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Materi ini tidak tersedia atau Anda tidak memiliki akses.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full h-fit flex flex-col">
      <div className="px-4 md:px-6 w-full py-4 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs font-mono">
              {material.code}
            </Badge>
            <div>
              <h1 className="text-xl font-bold">{material.title}</h1>
              <p className="text-sm text-muted-foreground">
                Tanya jawab dengan AI tentang materi ini
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 md:px-6 w-full h-fit">
        <div className="max-w-4xl mx-auto h-fit flex flex-col">
          <div className="flex-1 py-4 overflow-y-hidden">
            <div className="space-y-4 h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Mulai percakapan
                  </h3>
                  <p className="text-muted-foreground">
                    Tanyakan apapun tentang materi "{material.title}"
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
                          <p
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: processMarkdown(message.question),
                            }}
                          />
                        </div>
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* AI Answer */}
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          {message.isLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <p className="text-sm">AI sedang menjawab...</p>
                            </div>
                          ) : (
                            <p
                              className="text-sm whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: processMarkdown(message.answer),
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bottom-0 py-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Tanyakan sesuatu tentang materi ini..."
                  disabled={fetcher.state === "submitting"}
                  className="pr-12"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                {false ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button type="submit" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
