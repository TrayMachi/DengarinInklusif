import type { LoaderFunctionArgs } from "react-router";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MenuIndexLoader({ request }: LoaderFunctionArgs) {
  // Try to get user from server-side auth
  const user = await getAuthenticatedUser(request);

  return {
    user,
    timestamp: new Date().toISOString(),
  };
}
