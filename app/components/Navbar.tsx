import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { ThemeToggler } from "./ThemeToggler";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-15 justify-between flex h-22 items-center">
        <div className="mr-4 hidden md:flex">
          <a
            className="mr-6 flex items-center space-x-2"
            href="/"
            aria-label="Dengar Inklusif Home"
          >
            <img
              src="/LogoDengarinklusif.png"
              alt="Dengar Inklusif Logo"
              className="h-8 w-8"
            />

            <span className="hidden font-bold text-xl sm:inline-block">
              Dengar Inklusif
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-6 md:justify-end">
          <ThemeToggler />
          <GoogleLoginButton variant="ghost" size="sm" />
        </div>
      </div>
    </header>
  );
};
