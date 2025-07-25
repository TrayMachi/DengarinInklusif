import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

export interface Flashcard {
  flashcardPage: FlashcardPage[];
}

export interface FlashcardPage {
  id: string;
  flashcardId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export async function FlashcardLoader(args: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(args.request);
  const code = args.params.code as string;

  if (!user) {
    return { material: null };
  }

  const material = await prisma.material.findUnique({
    where: {
      code: code,
      email: user?.email || undefined,
    },
    select: {
      flashcard: {
        select: {
          flashcardPage: true,
        },
      },
    },
  });

  return {
    ...(material?.flashcard?.flashcardPage || {}),
    pageCode: "flashcard",
  };
}
