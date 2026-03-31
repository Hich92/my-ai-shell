import { getGlobalSystemStatus } from "@/modules/core/actions";
import { ModeToggle } from "@/components/mode-toggle";
import { AccentColorSelector } from "@/components/accent-color-selector";
import { Button } from "@/components/ui/button";

export async function AppStatusBar() {
  const status = await getGlobalSystemStatus();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 h-9 flex items-center justify-between px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t select-none">
      {/* LEFT: System Health */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </div>
          <span className="text-xs font-semibold text-foreground">
            System Online
          </span>
        </div>
        
        <div className="h-4 w-px bg-border" />
        
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-sm bg-muted/50 border">
           <div className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
           <span className="text-[10px] font-bold text-foreground/80 tabular-nums">SQL-LIVE</span>
        </div>
      </div>

      {/* CENTER: Activity Radar */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider opacity-50">
          Radar /
        </span>
        <span className="text-xs font-semibold text-foreground">
          {status.pendingActivities} Tasks Pending
        </span>
        <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
        <span className="text-[10px] font-medium text-muted-foreground uppercase">
          Standard Ops
        </span>
      </div>

      {/* RIGHT: Personalization & Version */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-x px-3 h-9">
          <ModeToggle />
          <AccentColorSelector />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-medium text-muted-foreground/60 tabular-nums cursor-help" title="Build: 0.1.0-alpha">
            v0.1.0
          </span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-tight text-muted-foreground hover:text-foreground">
            Audit Logs
          </Button>
        </div>
      </div>
    </footer>
  );
}
