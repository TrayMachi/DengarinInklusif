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
    description: string;
  };
  flashcard?: {
    flashcardPage: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface FlashcardModuleProps {
  material: Material;
}

export const FlashcardModule: React.FC<FlashcardModuleProps> = ({
  material,
}) => {
  return (
    <main className="flex-1">
      {material.flashcard?.flashcardPage?.map((flashcard) => (
        <div key={flashcard.question}>
          <h2>{flashcard.question}</h2>
          <p>{flashcard.answer}</p>
        </div>
      ))}
    </main>
  );
};
