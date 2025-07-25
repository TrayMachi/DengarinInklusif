import { useState, useEffect } from "react";
import { useLoaderData, useFetcher, useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { FileText, Calendar, Play, Loader2, RefreshCw } from "lucide-react";

export const MateriDetailModule = () => {
  const { material } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle") {
      setRegenerating(false);
    }
  }, [fetcher.state]);

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

  const handleRegenerate = () => {
    setRegenerating(true);
    const formData = new FormData();
    formData.append("action", "regenerate-flashcards");
    formData.append("materialId", material.id);
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <main className="flex-1 w-full py-12 md:py-24 lg:py-32">
      <div className="px-4 md:px-6 w-full">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-xs font-mono">
                  {material.code}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Intl.DateTimeFormat("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(material.createdAt))}
                </div>
              </div>
              <CardTitle className="mt-2 text-2xl font-bold">
                {material.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {material.materialContent?.description ||
                  "No description available"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:flex lg:flex-row gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={regenerating || fetcher.state === "submitting"}
                  className="flex-1"
                >
                  {regenerating || fetcher.state === "submitting" ? (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-2" />
                  )}
                  {regenerating || fetcher.state === "submitting"
                    ? "Generating..."
                    : "Remake Flashcards"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() =>
                    navigate(`/menu/materi/${material.code}/flashcard`)
                  }
                >
                  <Play className="h-3 w-3 mr-2" />
                  Flashcard
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => navigate(`/menu/materi/${material.code}/qna`)}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Tanya Jawab
                </Button>
                <Button
                  onClick={() =>
                    navigate(`/menu/materi/${material.code}/rangkuman`)
                  }
                  size="sm"
                  className="flex-1"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Rangkuman
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};
