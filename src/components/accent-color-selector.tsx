"use client";

import { useAccent } from "@/components/theme-accent-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  { id: "monochrome", name: "Pure Monochrome", color: "bg-foreground border border-border" },
  { id: "slate", name: "Refined Neutral", color: "bg-slate-400" },
  { id: "red", name: "Sovereign Red", color: "bg-red-600" },
  { id: "green", name: "Emerald Signal", color: "bg-emerald-500" },
  { id: "cobalt", name: "System Cobalt", color: "bg-blue-600" },
  { id: "violet", name: "Luxe Violet", color: "bg-violet-600" },
  { id: "amber", name: "Golden Amber", color: "bg-amber-500" },
  { id: "rose", name: "Creative Rose", color: "bg-rose-500" },
] as const;

export function AccentColorSelector() {
  const { accent, setAccent } = useAccent();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-none border-[0.5px] border-zinc-100 dark:border-zinc-900 opacity-50 hover:opacity-100 hover:bg-transparent transition-all"
          title="Personnaliser l'accent"
        >
          <Palette className="h-4 w-4" strokeWidth={1} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-none bg-background border-zinc-100 dark:border-zinc-900 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2 opacity-50">
          Accent Bespoke
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-1 py-1">
          {COLORS.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setAccent(c.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2 cursor-pointer rounded-none transition-colors",
                accent === c.id ? "bg-zinc-50 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-2.5 w-2.5 rounded-full", c.color)} />
                <span className="text-[10px] font-light uppercase tracking-widest leading-none">
                  {c.name}
                </span>
              </div>
              {accent === c.id && (
                <Check className="h-3 w-3 text-foreground opacity-50" strokeWidth={1} />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
