import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { MaterialsModule } from "~/modules/MaterialsModule";
import { MaterialsLoader } from "~/modules/MaterialsModule/loader";
import { MaterialsAction } from "~/modules/MaterialsModule/action";

export async function loader(args: LoaderFunctionArgs) {
  return MaterialsLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MaterialsAction(args);
}

export default function MaterialsPage() {
  const { materials } = useLoaderData<typeof loader>();
  return <MaterialsModule materials={materials} />;
}
