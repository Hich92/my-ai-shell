"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Command as CommandIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 transition-all">
      {/* LEFT: Logo area */}
      <div className="flex items-center gap-4 w-[280px]">
        <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
        <span className="text-lg font-bold tracking-tight select-none">
          AI Shell
        </span>
      </div>

      {/* CENTER: Global Search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          <Input 
            placeholder="Search resources, entities or logs..." 
            className="w-full h-9 pl-10 pr-4 rounded-md bg-muted/40 border border-border/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-input transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity select-none hidden md:flex">
             <CommandIcon className="h-3 w-3" />
             <span className="text-[10px] font-bold">F</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 w-[280px] justify-end">
        <Button
          variant="outline"
          size="sm"
          className="hidden lg:flex items-center gap-2 h-9 border bg-muted/30 hover:bg-accent px-4"
        >
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Ask Beth</span>
          <div className="flex items-center gap-1 opacity-20 px-1 border rounded-sm ml-1">
             <CommandIcon className="h-2.5 w-2.5" />
             <span className="text-[9px]">K</span>
          </div>
        </Button>
        
        <Button
          size="sm"
          className="h-9 px-5 gap-2 font-semibold shadow-sm"
        >
          Start Conversation
        </Button>
      </div>
    </header>
  );
}
