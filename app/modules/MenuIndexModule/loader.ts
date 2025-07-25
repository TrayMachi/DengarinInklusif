import type { LoaderFunctionArgs } from "react-router";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MenuIndexLoader({ request }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);

  return {
    user,
    timestamp: new Date().toISOString(),
    pageCode: "menu",
  };
}
