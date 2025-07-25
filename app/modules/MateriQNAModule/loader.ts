import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MateriQNALoader({ request, params }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);
  const code = params?.code;

  if (!user || !user.email || !code) {
    return { material: null, userQuestions: [] };
  }

  const material = await prisma.material.findFirst({
    where: {
      code,
      email: user.email,
    },
    include: {
      materialContent: true,
      userQuestion: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return {
    material,
    userQuestions: material?.userQuestion || [],
  };
}
