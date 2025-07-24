import { Home } from "lucide-react";
import { ThemeProvider } from '~/components/context/theme-provider';
import { Outlet, type LoaderFunctionArgs } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { createClient } from "~/utils/supabase.server";

export function ErrorBoundary() {
  return (
    <main className="bg-white text-black dark:bg-black dark:text-white">
      <main className="max-w-[1440px] mx-auto min-h-screen border-x-[2px] border-component-light-border dark:border-component-dark-border">
        <div className="h-screen flex items-center justify-center flex-col gap-4">
          <h1 className="text-3xl font-unbounded">Terjadi Kesalahan!</h1>
          <a href="/">
            {/* <Button> */}
            <Home />
            Home
            {/* </Button> */}
          </a>
        </div>
      </main>
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  // const supabase = createClient(request);
  // const { data: todos } = await supabase.from("todos").select();

  // return { todos };
  return null;
}

export default function Index() {
  // const { todos } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="bg-component-light-frame text-black dark:bg-component-dark-frame dark:text-white">
        <main className="pt-15  max-w-[1920px] mx-auto min-h-screen border-x-[2px] border-component-light-border dark:border-component-dark-border overflow-x-hidden flex flex-col">
          <Outlet />

          {/* Example of using the todos data */}
          {/* <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Todos from Supabase:</h2>
            <ul className="space-y-2">
              {todos?.map((todo) => (
                <li
                  key={todo.id}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
                >
                  {todo.name}
                </li>
              ))}
            </ul>
          </div> */}

          <Toaster />
        </main>
      </main>
    </ThemeProvider>
  );
}
