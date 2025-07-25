import React, { useState, useEffect } from "react";
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
  Play,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useFetcher } from "react-router";
import { getCurrentUser, type AuthUser } from "~/utils/auth.client";

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
  const fetcher = useFetcher();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [regeneratingFlashcards, setRegeneratingFlashcards] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user?.email) {
          const userMaterials = materials.filter(
            (material) => material.email === user.email
          );
          setFilteredMaterials(userMaterials);
        } else {
          setFilteredMaterials([]);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setFilteredMaterials([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [materials]);

  useEffect(() => {
    if (fetcher.state === "idle") {
      setRegeneratingFlashcards(null);

      if (fetcher.data?.success) {
        console.log("Flashcards regenerated successfully!");
      } else if (fetcher.data?.error) {
        console.error("Error regenerating flashcards:", fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleRegenerateFlashcards = (materialId: string) => {
    setRegeneratingFlashcards(materialId);

    const formData = new FormData();
    formData.append("action", "regenerate-flashcards");
    formData.append("materialId", materialId);

    fetcher.submit(formData, { method: "POST" });
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <main className="flex-1 w-full">
      <section className="w-full h-full py-12 md:py-10 lg:py-20">
        <div className="px-4 md:px-6 w-full">
          <div className="mx-auto">
            <div className="flex justify-between mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Materi Kamu
              </h2>
              <Button
                variant={"secondary"}
                onClick={() => navigate("/menu/materi/tambah")}
                size="sm"
              >
                Tambahkan Materi
              </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <Card
                    key={material.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-xs font-mono">
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
                          <span>Updated {formatDate(material.updatedAt)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          variant={"secondary"}
                          onClick={() =>
                            navigate(`/menu/materi/flashcard/${material.code}`)
                          }
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Flashcard
                        </Button>
                        <Button size="sm" variant={"secondary"}>
                          <FileText className="h-3 w-3 mr-2" />
                          Tanya Jawab
                        </Button>
                      </div>
                      <div className="mt-2 w-full flex gap-2">
                        <Button size="sm" className="flex-1">
                          <FileText className="h-3 w-3 mr-2" />
                          Rangkuman
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRegenerateFlashcards(material.id)
                          }
                          disabled={regeneratingFlashcards === material.id}
                        >
                          {regeneratingFlashcards === material.id ? (
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-2" />
                          )}
                          {regeneratingFlashcards === material.id
                            ? "Generating..."
                            : "Regenerate"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
