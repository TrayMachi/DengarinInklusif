import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { MaterialsModule } from "~/modules/MaterialsModule";
import { MaterialsLoader } from "~/modules/MaterialsModule/loader";

export async function loader(args: LoaderFunctionArgs) {
    return MaterialsLoader(args);
}

export default function MaterialsPage() {
  const { materials } = useLoaderData<typeof loader>();
  return <MaterialsModule materials={materials} />;
}
