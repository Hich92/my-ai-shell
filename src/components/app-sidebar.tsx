"use client";

import {
  LayoutDashboard,
  UploadCloud,
  ListTodo,
  CheckCircle,
  FolderKanban,
  FileSearch,
  ShieldCheck,
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

const pilotageItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
];

const traitementItems = [
  { title: "Ingestion", url: "/ingestion", icon: UploadCloud },
  { title: "Liste Documents", url: "/extraction", icon: ListTodo },
  { title: "Validation", url: "/validation", icon: CheckCircle },
];

const gouvernanceItems = [
  { title: "Espaces de travail", url: "/projects", icon: FolderKanban },
  { title: "Modèles", url: "/models", icon: FileSearch },
  { title: "Audit", url: "/audit", icon: ShieldCheck },
];

const systemeItems = [
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset" side="left">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow">AI</div>
           <span className="font-bold text-lg tracking-tight">AI Shell </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* PILOTAGE */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Pilotage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {pilotageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <item.icon className="h-5 w-5 mr-1" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* TRAITEMENT */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Traitement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {traitementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <item.icon className="h-5 w-5 mr-1" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GOUVERNANCE */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Gouvernance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {gouvernanceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <item.icon className="h-5 w-5 mr-1" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SYSTÈME */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {systemeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
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
