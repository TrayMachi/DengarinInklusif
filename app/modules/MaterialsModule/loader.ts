import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";

export async function MaterialsLoader({ request }: LoaderFunctionArgs) {
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
