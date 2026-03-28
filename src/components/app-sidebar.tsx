"use client";

import {
  LayoutDashboard,
  FileText,
  FileSearch,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    url: "#",
    icon: FileText,
  },
  {
    title: "Extraction",
    url: "#",
    icon: FileSearch,
  },
  {
    title: "Paramètres",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset" side="left">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow">AI</div>
           <span className="font-bold text-lg tracking-tight">AI Shell</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Menu principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={item.title === 'Dashboard'}>
                    <a href={item.url} className="font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <item.icon className="h-5 w-5 mr-1" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
