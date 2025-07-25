import React, { useState } from "react";
import { useLoaderData } from "react-router";
import type { FlashcardPage } from "./loader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardModuleProps {
  cards: Flashcard[];
}

export const FlashcardModule = () => {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const cards = useLoaderData<FlashcardPage[]>();

  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-xl mx-auto p-8 text-center">
          <CardHeader>
            <CardTitle>Tidak ada flashcard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tambahkan flashcard untuk mulai belajar!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const card = cards[current];

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Card className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center shadow-xl">
        <CardHeader className="w-full text-center">
          <CardTitle className="text-xl md:text-xl font-bold mb-4">
            {showAnswer
              ? "Jawaban"
              : `Pertanyaan ${current + 1} dari ${cards.length}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center justify-center">
          <div className="min-h-[120px] flex items-center justify-center text-xl md:text-2xl font-semibold mb-8">
            {showAnswer ? card.answer : card.question}
          </div>
          {!showAnswer ? (
            <Button
              size="lg"
              className="mb-6"
              onClick={() => setShowAnswer(true)}
            >
              Lihat Jawaban
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              className="mb-6"
              onClick={() => setShowAnswer(false)}
            >
              Lihat Pertanyaan
            </Button>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              disabled={current === 0}
              onClick={() => {
                setCurrent((prev) => Math.max(prev - 1, 0));
                setShowAnswer(false);
              }}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={current === cards.length - 1}
              onClick={() => {
                setCurrent((prev) => Math.min(prev + 1, cards.length - 1));
                setShowAnswer(false);
              }}
            >
              Selanjutnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
