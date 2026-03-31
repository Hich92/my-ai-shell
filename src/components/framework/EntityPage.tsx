import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export type ViewMode = "list" | "details" | "edit";

interface EntityPageProps {
  /**
   * The current view mode. Controls the outer layout chrome.
   * - list: full-bleed table shell
   * - details: read-only entity wrapper (reserves DockBar space)
   * - edit: unlocked form wrapper (reserves DockBar space)
   */
  viewMode: ViewMode;
  /** Page title rendered in the header area */
  title: string;
  /** Short subtitle / breadcrumb context */
  subtitle?: string;
  /** Optional lucide icon rendered beside the title (list mode) */
  icon?: LucideIcon;
  /** Right-side slot for CTAs (New Entity, Archive, etc.) */
  actions?: ReactNode;
  /** Main content area */
  children: ReactNode;
}

/**
 * EntityPage — Universal layout HOC for AI Shell OS
 */
export function EntityPage({
  viewMode,
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
}: EntityPageProps) {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* ── Standard Header ────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="flex size-9 items-center justify-center rounded-md border bg-muted/50">
                <Icon className="size-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <h1 className="text-base font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium opacity-70">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>
      </div>
    );
  }

  // details / edit modes
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {children}
    </div>
  );
}
