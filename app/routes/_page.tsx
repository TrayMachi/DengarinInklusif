import { Home } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Outlet, type LoaderFunctionArgs } from "react-router";
import { Toaster } from "~/components/ui/sonner";

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

export async function loader(args: LoaderFunctionArgs) {
    return null
}

export default function Index() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="bg-component-light-frame text-black dark:bg-component-dark-frame dark:text-white">
        <main className="pt-15  max-w-[1920px] mx-auto min-h-screen border-x-[2px] border-component-light-border dark:border-component-dark-border overflow-x-hidden flex flex-col">
          <Outlet />
          <Toaster />
        </main>
      </main>
    </ThemeProvider>
  );
}
