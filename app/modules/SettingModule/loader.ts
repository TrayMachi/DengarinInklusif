import type { LoaderFunctionArgs } from "react-router";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function SettingLoader({ request }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);

  return {
    user,
  };
}
