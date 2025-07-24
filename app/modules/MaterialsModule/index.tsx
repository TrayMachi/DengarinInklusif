import React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FileText, Calendar, MessageSquare, Play, Clock } from "lucide-react";

interface Material {
  id: string;
  title: string;
  code: string;
  email: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  materialContent?: {
    content: string;
  };
  flashcard?: {
    flashcardPage: Array<{
      question: string;
      answer: string;
    }>;
  };
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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <main className="flex-1 w-full">
      <section className="w-full h-full py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Your Materials
              </h2>
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
                        {material.materialContent?.content ||
                          "No description available"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>
                              {material.flashcard?.flashcardPage?.length || 0}{" "}
                              Cards
                            </span>
                          </div>
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
                        <Button className="flex-1" size="sm">
                          <Play className="h-3 w-3 mr-2" />
                          Study
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-2" />
                          View
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
