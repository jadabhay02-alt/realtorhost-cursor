"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  FileText,
  Home,
  Kanban,
  LayoutDashboard,
  List,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/marketing/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", href: "/dashboard/leads", icon: Users },
  { title: "Clients", href: "/dashboard/clients", icon: UserCircle },
  { title: "Pipeline", href: "/dashboard/pipeline", icon: Kanban },
  { title: "Listings", href: "/dashboard/listings", icon: List },
  { title: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { title: "Documents", href: "/dashboard/documents", icon: FileText },
];

export function AppSidebar({
  organizationName,
}: {
  organizationName: string;
  planLabel?: string;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-border/80">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <BrandLogo href="/dashboard" />
        <p className="mt-2 truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {organizationName}
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                  >
                    <item.icon strokeWidth={1.5} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard/settings" />}
              isActive={pathname.startsWith("/dashboard/settings")}
            >
              <Settings strokeWidth={1.5} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Link
          href="/"
          className="flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
        >
          <Home className="h-3 w-3" />
          Marketing site
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
