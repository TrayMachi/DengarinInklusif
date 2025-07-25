import React, { useEffect } from "react";
import { useLoaderData } from "react-router";
import type { FlashcardPage } from "./loader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useFlashcard } from "~/components/context/flashcard-context";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardModuleProps {
  cards: Flashcard[];
}

export const FlashcardModule = () => {
  const cards = useLoaderData<FlashcardPage[]>();
  const flashcard = useFlashcard();

  // Initialize cards in context when component mounts
  useEffect(() => {
    console.log("FlashcardModule useEffect - cards:", cards?.length || 0);
    if (cards && cards.length > 0) {
      console.log("Initializing flashcard context with cards:", cards);
      flashcard.setCards(cards);
    }
  }, [cards, flashcard.setCards]);

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

  const card = cards[flashcard.current];

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Card className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center shadow-xl !gap-0">
        <CardHeader className="w-full text-center">
          <CardTitle className="text-[16px] font-bold text-muted-foreground">
            {flashcard.showAnswer
              ? "Jawaban"
              : `Pertanyaan ${flashcard.current + 1} dari ${
                  flashcard.totalCards
                }`}
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center justify-center">
          <div className="min-h-[100px] flex items-center justify-center text-xl md:text-2xl font-semibold mb-8">
            {flashcard.showAnswer ? card.answer : card.question}
          </div>
          {!flashcard.showAnswer ? (
            <Button
              size="lg"
              className="mb-6"
              onClick={flashcard.showAnswerAction}
            >
              Lihat Jawaban
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              className="mb-6"
              onClick={flashcard.showQuestionAction}
            >
              Lihat Pertanyaan
            </Button>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              disabled={flashcard.current === 0}
              onClick={flashcard.previousCard}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={flashcard.current === flashcard.totalCards - 1}
              onClick={flashcard.nextCard}
            >
              Selanjutnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
