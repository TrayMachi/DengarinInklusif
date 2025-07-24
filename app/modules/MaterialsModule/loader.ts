import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MaterialsLoader({ request }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);

  const materials = await prisma.material.findMany({
    include: {
      materialContent: true,
      flashcard: true,
      _count: {
        select: { userQuestion: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { materials };
}
