import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";

export async function MaterialsLoader({ request }: LoaderFunctionArgs) {
  // const materials = await prisma.material.findMany({
  //   include: {
  //     materialContent: true,
  //     flashcard: true,
  //     _count: {
  //       select: { userQuestion: true }
  //     }
  //   },
  //   orderBy: { createdAt: 'desc' }
  // });

  const materials = [
    {
      id: "1",
      title: "Introduction to Physics",
      code: "PHY101",
      email: "user@example.com",
      fileUrl: "/materials/physics-intro.pdf",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      materialContent: {
        content:
          "Basic concepts of physics including motion, energy, and forces.",
      },
      flashcard: {
        flashcardPage: [
          {
            question: "What is force?",
            answer: "A push or pull acting upon an object",
          },
          { question: "What is energy?", answer: "The capacity to do work" },
        ],
      },
      _count: { userQuestion: 5 },
    },
    {
      id: "2",
      title: "Mathematics Fundamentals",
      code: "MATH101",
      email: "user@example.com",
      fileUrl: "/materials/math-fundamentals.pdf",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
      materialContent: {
        content: "Basic mathematical concepts including algebra and geometry.",
      },
      flashcard: {
        flashcardPage: [
          {
            question: "What is algebra?",
            answer: "A branch of mathematics dealing with symbols",
          },
          {
            question: "What is geometry?",
            answer: "Study of shapes and spatial relationships",
          },
        ],
      },
      _count: { userQuestion: 3 },
    },
    {
      id: "3",
      title: "English Literature Basics",
      code: "ENG101",
      email: "user@example.com",
      fileUrl: "/materials/english-literature.pdf",
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      materialContent: {
        content: "Introduction to English literature and literary analysis.",
      },
      flashcard: {
        flashcardPage: [
          {
            question: "What is a metaphor?",
            answer: "A figure of speech comparing two things",
          },
          {
            question: "What is alliteration?",
            answer: "Repetition of initial consonant sounds",
          },
        ],
      },
      _count: { userQuestion: 7 },
    },
  ];

  return { materials };
}
