import { LayoutDashboard } from "lucide-react";
import type * as React from "react";

import { Link, useLoaderData, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { sidebarItems } from "../const";
import type { MenuLoader } from "../loader";

export function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = useLoaderData<typeof MenuLoader>();
  const location = useLocation();
  const locationPath = location.pathname;

  return (
    <Sidebar
      variant="inset"
      className="z-0 mt-22 max-h-[400px] "
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={locationPath === "/menu"}
              size="lg"
              asChild
              tooltip="Dashboard"
            >
              <Link to="/menu">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Menu</span>
                  <span className="text-xs text-muted-foreground">
                    Menu Utama
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.tooltip}
                  isActive={locationPath === item.route}
                >
                  <Link to={item.route} className="font-medium">
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
