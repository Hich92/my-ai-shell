"use client";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string;
  currentDir: "asc" | "desc";
  onSort: (key: string, dir: "asc" | "desc") => void;
  className?: string;
}

export function DataTableColumnHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  const isActive = currentSort === sortKey;
  const nextDir = isActive && currentDir === "asc" ? "desc" : "asc";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-7 px-2 -ml-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      onClick={() => onSort(sortKey, nextDir)}
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUp className="ml-1.5 h-3 w-3" />
        ) : (
          <ArrowDown className="ml-1.5 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1.5 h-3 w-3 opacity-30" />
      )}
    </Button>
  );
}
