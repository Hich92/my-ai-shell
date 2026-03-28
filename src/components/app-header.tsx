"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/" className="font-medium">AI Shell</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex-1 flex justify-center max-w-lg w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un document, un projet, une donnée..." 
          className="w-full pl-9 bg-muted/40 border-muted-foreground/20 focus-visible:ring-1 rounded-full shadow-inner" 
        />
      </div>
      
      <div className="flex items-center justify-end gap-5 w-1/3">
        <Button variant="outline" className="gap-2 text-primary border-primary/20 hover:bg-primary/5 rounded-full shadow-sm hidden md:flex">
          <Sparkles className="h-4 w-4" />
          Parler à Beth
        </Button>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="Utilisateur" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">HA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
