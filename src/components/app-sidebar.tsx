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
  StickyNote,
  Users,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  isFuture?: boolean;
};

const pilotageItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, isFuture: true },
  { title: "Contacts", url: "/contacts", icon: Users, isFuture: false },
];

const traitementItems: MenuItem[] = [
  { title: "Ingestion", url: "/ingestion", icon: UploadCloud, isFuture: true },
  { title: "Liste Documents", url: "/extraction", icon: ListTodo, isFuture: true },
  { title: "Validation", url: "/validation", icon: CheckCircle, isFuture: true },
];

const gouvernanceItems: MenuItem[] = [
  { title: "Espaces", url: "/projects", icon: FolderKanban, isFuture: true },
  { title: "Modèles", url: "/models", icon: FileSearch, isFuture: true },
  { title: "Audit", url: "/audit", icon: ShieldCheck, isFuture: true },
];

const systemeItems: MenuItem[] = [
  { title: "Paramètres", url: "/settings", icon: Settings, isFuture: true },
];

function renderMenuItem(item: MenuItem) {
  const ButtonContent = (
    <a 
      href={item.isFuture ? '#' : item.url} 
      className={`font-medium transition-colors w-full flex items-center justify-between ${item.isFuture ? 'text-muted-foreground/50 cursor-not-allowed' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={(e) => item.isFuture && e.preventDefault()}
    >
      <div className="flex items-center">
        <item.icon className={`h-5 w-5 mr-2 ${item.isFuture ? 'opacity-50' : ''}`} />
        <span>{item.title}</span>
      </div>
      {item.isFuture && (
         <Badge variant="outline" className="text-[9px] px-1 py-0 border-muted-foreground/20 text-muted-foreground/60 uppercase">Futur</Badge>
      )}
    </a>
  );

  if (item.isFuture) {
    return (
      <Tooltip key={item.title}>
        <TooltipTrigger asChild>
          <div className="w-full">
            <SidebarMenuButton asChild tooltip={undefined}>
               {ButtonContent}
            </SidebarMenuButton>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Fonctionnalité "{item.title}" à venir</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        {ButtonContent}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

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
              {pilotageItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* TRAITEMENT */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Traitement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {traitementItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GOUVERNANCE */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Gouvernance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {gouvernanceItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SYSTÈME */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground mt-4 tracking-wider">Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {systemeItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 flex items-center justify-center border-t border-border bg-muted/10">
         <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono font-medium">
           v{process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0-alpha"}
         </span>
      </SidebarFooter>
    </Sidebar>
  );
}
