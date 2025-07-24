import React from "react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { ThemeToggler } from "./ThemeToggler";

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
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                DI
              </span>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">
              Dengar Inklusif
            </span>
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    <NavigationMenuLink className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">
                        Audio Lessons
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Interactive voice-based learning content
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">
                        Document to Speech
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Convert PDFs and images to audio
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  href="#background"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  href="#solution"
                >
                  Solution
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeToggler />
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};
