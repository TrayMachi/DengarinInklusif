import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

interface FlashcardContextType {
  current: number;
  showAnswer: boolean;
  totalCards: number;
  currentQuestion: string;
  currentAnswer: string;

  // Actions
  nextCard: () => void;
  previousCard: () => void;
  showAnswerAction: () => void;
  showQuestionAction: () => void;
  readQuestion: () => void;
  readAnswer: () => void;

  // Setup
  setCards: (cards: any[]) => void;
  reset: () => void;
}

const FlashcardContext = createContext<FlashcardContextType | null>(null);

export const useFlashcard = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcard must be used within FlashcardProvider");
  }
  return context;
};

interface FlashcardProviderProps {
  children: React.ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({
  children,
}) => {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cards, setCardsState] = useState<any[]>([]);

  // Refs to track latest state values for TTS functions
  const currentRef = useRef(current);
  const cardsRef = useRef(cards);

  // Update refs when state changes
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const handlePlayAudio = useCallback(async (audio: HTMLAudioElement) => {
    try {
      await audio.play();
    } catch (error) {
      console.error("Audio autoplay was prevented:", error);
    }
  }, []);

  const speakText = useCallback(
    async (text: string, languageCode: string = "id-ID") => {
      if (!text || text.trim() === "") {
        console.log("No text to speak");
        return;
      }

      console.log("Speaking text:", text);

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, languageCode }),
          credentials: "include",
        });

        const data = await response.json();

        if (data.success && data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          await handlePlayAudio(audio);
        } else {
          throw new Error("TTS API returned no audio content");
        }
      } catch (error) {
        console.error("Error generating TTS:", error);
        // Fallback to browser's speech synthesis
        if ("speechSynthesis" in window) {
          console.log("Using browser speech synthesis fallback");
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = languageCode;
          speechSynthesis.speak(utterance);
        }
      }
    },
    [handlePlayAudio]
  );

  const nextCard = () => {
    console.log(
      "nextCard called - current:",
      current,
      "total cards:",
      cards.length
    );
    if (current < cards.length - 1) {
      console.log("Moving to next card from", current, "to", current + 1);
      setCurrent(current + 1);
      setShowAnswer(false);
    } else {
      console.log("Already at last card");
    }
  };

  const previousCard = () => {
    console.log(
      "previousCard called - current:",
      current,
      "total cards:",
      cards.length
    );
    if (current > 0) {
      console.log("Moving to previous card from", current, "to", current - 1);
      setCurrent(current - 1);
      setShowAnswer(false);
    } else {
      console.log("Already at first card");
    }
  };

  const showAnswerAction = () => {
    console.log("Showing answer - current showAnswer state:", showAnswer);
    setShowAnswer(true);
  };

  const showQuestionAction = () => {
    console.log("Showing question - current showAnswer state:", showAnswer);
    setShowAnswer(false);
  };

  const readQuestion = () => {
    console.log(
      "readQuestion called - current:",
      current,
      "total cards:",
      cards.length
    );

    // Use timeout to get the latest state values
    setTimeout(() => {
      const latestCurrent = currentRef.current;
      const latestCards = cardsRef.current;
      console.log(
        "readQuestion executing - latest current:",
        latestCurrent,
        "latest total cards:",
        latestCards.length
      );

      const currentCard = latestCards[latestCurrent];
      if (currentCard?.question) {
        console.log("Reading question:", currentCard.question);
        speakText(currentCard.question);
      } else {
        console.log("No question to read");
      }
    }, 2000);
  };

  const readAnswer = () => {
    console.log(
      "readAnswer called - current:",
      current,
      "total cards:",
      cards.length
    );

    // Use timeout to get the latest state values
    setTimeout(() => {
      const latestCurrent = currentRef.current;
      const latestCards = cardsRef.current;
      console.log(
        "readAnswer executing - latest current:",
        latestCurrent,
        "latest total cards:",
        latestCards.length
      );

      const currentCard = latestCards[latestCurrent];
      if (currentCard?.answer) {
        console.log("Reading answer:", currentCard.answer);
        speakText(currentCard.answer);
      } else {
        console.log("No answer to read");
      }
    }, 2000);
  };

  const setCards = useCallback((newCards: any[]) => {
    console.log("setCards called with:", newCards.length, "cards");
    setCardsState(newCards);
    setCurrent(0);
    setShowAnswer(false);
  }, []);

  const reset = useCallback(() => {
    console.log("Resetting flashcard context");
    setCurrent(0);
    setShowAnswer(false);
  }, []);

  // Compute current card safely
  const currentCard = cards[current] || { question: "", answer: "" };

  // Debug log for state changes
  console.log(
    "FlashcardProvider render - current:",
    current,
    "showAnswer:",
    showAnswer,
    "totalCards:",
    cards.length
  );

  const value: FlashcardContextType = {
    current,
    showAnswer,
    totalCards: cards.length,
    currentQuestion: currentCard.question,
    currentAnswer: currentCard.answer,

    nextCard,
    previousCard,
    showAnswerAction,
    showQuestionAction,
    readQuestion,
    readAnswer,

    setCards,
    reset,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
