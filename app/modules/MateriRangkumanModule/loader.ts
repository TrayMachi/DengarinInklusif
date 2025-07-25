import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAuthenticatedUser } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma";

export async function MateriRangkumanLoader({ request, params }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);
  const code = params.code as string;

  if (!user) {
    return null;
  }

  const material = await prisma.material.findUnique({
    where: {
      code: code,
      email: user?.email || undefined,
    },
    select: {
      materialContent: true,
      title: true,
    },
  });

  if (!material) {
    redirect("/404");
  }

  return material;
}
