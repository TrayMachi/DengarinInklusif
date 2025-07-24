import { Home } from "lucide-react";
import { ThemeProvider } from "~/components/context/theme-provider";
import { AuthProvider } from "~/components/context/auth-context";
import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { isAuthenticatedServer } from "~/utils/auth.server";

export function ErrorBoundary() {
  return (
    <main className="bg-background text-foreground dark:bg-background dark:text-foreground">
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
  const url = new URL(request.url);
  const authenticated = await isAuthenticatedServer(request);
  const pathname = url.pathname;

  if (pathname !== "/" && pathname !== "/404" && !authenticated) {
    return redirect("/");
  }

  return null;
}

export default function Index() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <main className="text-black dark:text-white">
          <Navbar />
          <main className="max-w-[1920px] mx-auto min-h-screen overflow-x-hidden flex flex-col items-center">
            <Outlet />
            <Toaster />
          </main>
          <Footer />
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}
