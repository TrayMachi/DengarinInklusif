import type { LoaderFunctionArgs } from "react-router";

export async function MenuLoader({ request }: LoaderFunctionArgs) {
  return { pageCode: "menu" };
}
