import type React from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { MainSidebar } from "./elements/MainSidebar";

export const MenuModule = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <MainSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 py-3 my-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-full" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, idx) => {
                const to = "/" + segments.slice(0, idx + 1).join("/");
                const label =
                  segment.charAt(0).toUpperCase() + segment.slice(1);
                return (
                  <div key={to} className="flex items-center gap-3">
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        asChild
                        className="font-ubuntu font-semibold"
                      >
                        <Link to={to}>{label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {idx < segments.length - 1 && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
