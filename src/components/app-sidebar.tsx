"use client";

import { 
  Users, 
  Wallet, 
  FileBox, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  {
    title: "Global Registry",
    description: "sys_org.entities · Core",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Finance Console",
    description: "sys_fin.ledger · Ledger",
    url: "/finance",
    icon: Wallet,
  },
  {
    title: "DMS Storage",
    description: "sys_io.vault · Archival",
    url: "/dms",
    icon: FileBox,
  },
];

const systemNav = [
  {
    title: "Audit Trail",
    description: "sys_log.compliance",
    url: "/audit",
    icon: ShieldCheck,
  },
  {
    title: "System Settings",
    description: "sys_conf.global",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" side="left" collapsible="icon">
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold select-none text-[10px]">
            AI
          </div>
          <span className="font-bold text-sm tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Shell OS
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* MAIN OPERATIONS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-4 group-data-[collapsible=icon]:hidden">
            Main Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={pathname.startsWith(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center w-full">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0 transition-transform group-hover:scale-105">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none ml-3 group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-xs">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight opacity-70">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction asChild showOnHover>
                    <Link href={item.url}>
                      <ChevronRight className="size-4" />
                      <span className="sr-only">Open {item.title}</span>
                    </Link>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SYSTEM CONTEXT */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-4 group-data-[collapsible=icon]:hidden">
            System Context
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={pathname.startsWith(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="flex items-center w-full">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0 transition-transform group-hover:scale-105">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none ml-3 group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-xs uppercase tracking-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction asChild showOnHover>
                    <Link href={item.url}>
                      <ChevronRight className="size-4 opacity-50" />
                    </Link>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 gap-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent group cursor-pointer transition-colors border border-transparent hover:border-sidebar-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-transparent">
          <Avatar className="h-8 w-8 rounded-md border shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="Archivist" />
            <AvatarFallback className="bg-muted text-[10px] font-bold uppercase">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold truncate">Archivist Desk</span>
            <span className="text-[10px] text-muted-foreground truncate uppercase font-semibold opacity-60 tracking-wider">Lead Instance</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
