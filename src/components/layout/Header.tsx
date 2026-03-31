"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Search, Command as CommandIcon, Users, Settings, ShieldCheck, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBreadcrumbs } from "./breadcrumb-context";

/**
 * Global Header - Search-Centric Vision
 * 
 * Architecture:
 * - Left: SidebarTrigger + Separator + Breadcrumb
 * - Center: Wide Command Search Bar (⌘K)
 * - Right: Vacuum (Minimalist)
 */
export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { labels } = useBreadcrumbs();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
      if (event.key === "/") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Dynamic breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);
  const mode = searchParams.get("mode");

  if (!isMounted) return null;

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          
          {/* LEFT: System Navigation */}
          <div className="flex items-center gap-4 shrink-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 mr-2" />
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                {segments.map((segment, index) => {
                  const href = `/${segments.slice(0, index + 1).join("/")}`;
                  const isLast = index === segments.length - 1 && !mode;
                  
                  // Use label from context if available, otherwise capitalize segment
                  const label = labels[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1));

                  return (
                    <React.Fragment key={href}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="max-w-[150px] truncate">{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={href} className="max-w-[120px] truncate">{label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}

                {mode && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-primary font-semibold">
                        {mode === "edit" ? "Editing..." : "Viewing..."}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* CENTER: Search-Centric Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              <Input
                placeholder="Search everything... (Press /)"
                className="w-full h-9 pl-10 pr-12 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded-md transition-all cursor-text shadow-none"
                onClick={() => setOpen(true)}
                readOnly
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                <kbd className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded border bg-background font-mono text-[9px] font-bold group-data-[collapsible=icon]:hidden">
                  <CommandIcon className="h-2.5 w-2.5" />
                </kbd>
                <kbd className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded border bg-background font-mono text-[9px] font-bold">
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* RIGHT: Vacuum (Minimalist) */}
          <div className="flex items-center justify-end w-32 hidden md:flex" />
        </div>
      </header>

      {/* COMMAND PALETTE (⌘K) */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Go to Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/contacts"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Open Global Registry</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="System">
            <CommandItem onSelect={() => runCommand(() => router.push("/audit"))}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>View Audit Logs</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>System Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
