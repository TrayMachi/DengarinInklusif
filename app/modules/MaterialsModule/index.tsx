import React, { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FileText,
  Calendar,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Material {
  id: string;
  title: string;
  code: string;
  email: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  materialContent?: {
    id: string;
    materialId: string;
    content: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  flashcard?: {
    id: string;
    materialId: string;
    createdAt: Date;
    updatedAt: Date;
    flashcardPage?: Array<{
      question: string;
      answer: string;
    }>;
  } | null;
  _count: {
    userQuestion: number;
  };
}

interface MaterialsModuleProps {
  materials: Material[];
}

export const MaterialsModule: React.FC<MaterialsModuleProps> = ({
  materials,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const lastSpokenPageRef = useRef<number | null>(null);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMaterials = materials.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const speakContent = useCallback(
    async (materials: Material[]) => {
      if (!speechEnabled) return;

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);

      try {
        let textToSpeak = "";

        if (materials.length === 0) {
          textToSpeak = "Tidak ada materi yang tersedia";
        } else {
          textToSpeak = `Halaman ${currentPage} dari ${totalPages}. `;
          materials.forEach((material, index) => {
            textToSpeak += `Materi ${index + 1}: ${material.title}. `;
            const code = material.code;
            textToSpeak += `Kode materi: ${code}. `;
            const description =
              material.materialContent?.description || "Tidak ada deskripsi";
            textToSpeak += `Deskripsi: ${description}. `;
          });
          textToSpeak += `Selesai, jika ingin melanjutkan ke halaman selanjutnya, silahkan ucapkan "materi selanjutnya" atau "materi sebelumnya" untuk kembali ke halaman sebelumnya.`;
        }

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textToSpeak,
            languageCode: "id-ID",
          }),
        });

        const data = await response.json();

        if (data.success && data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);

          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);

          await audio.play();
        } else {
          setIsSpeaking(false);
          console.error("TTS API error:", data.error);
        }
      } catch (error) {
        setIsSpeaking(false);
        console.error("Failed to fetch TTS:", error);
      }
    },
    [speechEnabled, currentPage, totalPages]
  );

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setSpeechEnabled((prev) => {
      const newEnabled = !prev;
      if (newEnabled) {
        lastSpokenPageRef.current = null;
      }
      return newEnabled;
    });
  };

  useEffect(() => {
    (window as any).materialsModule = {
      nextPage: handleNextPage,
      previousPage: handlePreviousPage,
    };

    return () => {
      delete (window as any).materialsModule;
    };
  }, [handleNextPage, handlePreviousPage]);

  useEffect(() => {
    if (speechEnabled && lastSpokenPageRef.current !== currentPage) {
      const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      const materialsForPage = materials.slice(startIdx, endIdx);

      const timer = setTimeout(() => {
        speakContent(materialsForPage);
        lastSpokenPageRef.current = currentPage;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPage, speechEnabled, materials]);

  return (
    <main className="flex-1 w-full">
      <section className="w-full h-full py-12 md:py-10 lg:py-20">
        <div className="px-4 md:px-6 w-full">
          <div className="mx-auto">
            <div className="flex max-md:flex-col justify-center max-md:items-center md:justify-between mb-12 max-md:w-full">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Materi Kamu
              </h2>
              <div className="flex gap-2 max-md:w-full max-md:flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSpeech}
                  className="flex items-center gap-2"
                >
                  {speechEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  {speechEnabled ? "TTS On" : "TTS Off"}
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => navigate("/menu/materi/tambah")}
                  size="sm"
                  className="max-md:w-full"
                >
                  Tambahkan Materi
                </Button>
              </div>
            </div>

            {/* Voice Command Instructions */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                💡 Tahan <strong>spasi</strong> dan ucapkan "
                <strong>materi selanjutnya</strong>" untuk halaman berikutnya atau "
                <strong>materi sebelumnya</strong>" untuk halaman sebelumnya
              </p>
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first learning material to get started
                </p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMaterials.map((material) => (
                    <Card
                      key={material.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => navigate(`/menu/materi/${material.code}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {material.code}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(material.createdAt)}
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {material.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {material.materialContent?.description ||
                            "No description available"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{material._count.userQuestion} Q&A</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Updated {formatDate(material.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>

                    <div className="flex items-center gap-2 mx-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2"
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Menampilkan {startIndex + 1}-
                  {Math.min(endIndex, materials.length)} dari {materials.length}{" "}
                  materi
                  {isSpeaking && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Volume2 className="h-4 w-4 animate-pulse" />
                      <span>Sedang membaca...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
