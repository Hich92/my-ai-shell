"use client";

import { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CompanionPanel } from "@/components/companion/companion-panel";

/**
 * BethTrigger — FAB flottant ancré en bas à droite.
 * Ouvre le CompanionPanel (3 onglets : Beth AI / Notes / Activité).
 */
export function BethTrigger({ targetId }: { targetId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          id="beth-fab-trigger"
          size="icon"
          className="
            fixed bottom-6 right-6 z-50
            h-14 w-14 rounded-full
            bg-primary text-primary-foreground
            shadow-[0_8px_32px_oklch(0.55_0.22_255_/_0.35)]
            hover:shadow-[0_12px_40px_oklch(0.55_0.22_255_/_0.5)]
            hover:scale-110
            transition-all duration-200 ease-out
            border border-primary/20
          "
          aria-label="Ouvrir le Compagnon"
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </Button>
      </SheetTrigger>
      <CompanionPanel targetId={targetId} />
    </Sheet>
  );
}
