import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MateriDetailLoader(args: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(args.request);
  const code = args.params?.code;

  if (!user || !user.email || !code) {
    return { material: null };
  }

  const material = await prisma.material.findUnique({
    where: {
      code,
      email: user.email,
    },
    include: {
      materialContent: true,
      flashcard: {
        include: {
          flashcardPage: true,
        },
      },
      _count: {
        select: { userQuestion: true },
      },
    },
  });

  return { material, pageCode: "material_detail" };
}
