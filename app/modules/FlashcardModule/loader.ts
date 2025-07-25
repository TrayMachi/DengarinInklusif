import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

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
    include: {
      materialContent: true,
      flashcard: true,
    },
  });

  console.log(material)

  return { material };
}
