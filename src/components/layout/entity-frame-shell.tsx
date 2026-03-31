"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Pencil, Save, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DockBar, DockItem } from "@/components/layout/dock-bar";
import { EntityFrameContext } from "@/components/layout/entity-frame-context";

// ─── NavArrows ────────────────────────────────────────────────────────────────

interface NavArrowsProps {
  prevId: string | null;
  nextId: string | null;
  basePath: string; // ex: "/contacts"
}

export function NavArrows({ prevId, nextId, basePath }: NavArrowsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 ml-3">
      <Button
        id="nav-prev-btn"
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
        disabled={!prevId}
        onClick={() => prevId && router.push(`${basePath}/${prevId}/edit`)}
        aria-label="Previous entity"
        title="Previous entity (Alt+Left)"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        id="nav-next-btn"
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
        disabled={!nextId}
        onClick={() => nextId && router.push(`${basePath}/${nextId}/edit`)}
        aria-label="Next entity"
        title="Next entity (Alt+Right)"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── EntityDock (contextual buttons) ─────────────────────────────────

interface EntityDockProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onSaveAndClose: () => void;
  onCancel: () => void;
}

function EntityDock({ isEditing, isSaving, onEdit, onSave, onSaveAndClose, onCancel, creationMode, submitFormId }: EntityDockProps & { creationMode?: boolean; submitFormId?: string }) {
  if (creationMode) {
    // Creation mode: unique submit button linked to form
    return (
      <DockItem>
        <Button
          id="dock-create-btn"
          type="submit"
          form={submitFormId}
          size="sm"
          className="gap-2 px-5 shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span className="text-xs font-semibold">Commit to Database</span>
        </Button>
      </DockItem>
    );
  }

  if (!isEditing) {
    // View mode: single "Edit" button
    return (
      <DockItem>
        <Button
          id="dock-edit-btn"
          size="sm"
          variant="outline"
          className="gap-2 px-5 border-primary/30 text-primary hover:bg-primary/5"
          onClick={onEdit}
          title="Edit (E)"
        >
          <Pencil className="h-4 w-4" />
          <span className="text-xs font-semibold">Edit</span>
        </Button>
      </DockItem>
    );
  }

  // Edit mode: 3 buttons
  return (
    <>
      <DockItem>
        <Button
          id="dock-cancel-btn"
          size="sm"
          variant="ghost"
          className="gap-2 px-4 text-muted-foreground hover:text-foreground"
          onClick={onCancel}
          disabled={isSaving}
          title="Cancel (Esc)"
        >
          <X className="h-4 w-4" />
          <span className="text-xs font-semibold">Cancel</span>
        </Button>
      </DockItem>
      <DockItem>
        <Button
          id="dock-save-btn"
          size="sm"
          className="gap-2 px-5 shadow-sm"
          onClick={onSave}
          disabled={isSaving}
          title="Save (⌘S)"
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="text-xs font-semibold">
            {isSaving ? "Saving..." : "Save"}
          </span>
        </Button>
      </DockItem>
      <DockItem>
        <Button
          id="dock-save-close-btn"
          size="sm"
          variant="outline"
          className="gap-2 px-5 border-primary/30 text-primary hover:bg-primary/5"
          onClick={onSaveAndClose}
          disabled={isSaving}
          title="Save & Close (⌘⇧S)"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-semibold">Save & Close</span>
        </Button>
      </DockItem>
    </>
  );
}

// ─── EntityFrameShell ─────────────────────────────────────────────────────────

interface EntityFrameShellProps {
  children: ReactNode;
  targetId?: string;
  prevId?: string | null;
  nextId?: string | null;
  /** Base path for sequential navigation, e.g., "/contacts" */
  basePath?: string;
  /** Enable creation mode: Dock shows a single submit button */
  creationMode?: boolean;
  /** ID of form to submit in creation mode */
  submitFormId?: string;
  /** Pre-activate edit mode on mount (e.g., when ?mode=edit in URL) */
  initialEditing?: boolean;
  /** React node injected in header (breadcrumb + nav) */
  headerSlot: ReactNode;
  /** React node injected in main (title + content) */
  mainSlot: ReactNode;
}

export function EntityFrameShell({
  children,
  targetId,
  prevId = null,
  nextId = null,
  basePath = "/contacts",
  creationMode = false,
  submitFormId,
  initialEditing = false,
  headerSlot,
  mainSlot,
}: EntityFrameShellProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [isSaving, setIsSaving] = useState(false);
  const saveCallbackRef = useRef<((andClose: boolean) => Promise<void>) | null>(null);
  const router = useRouter();

  // Register save callback from child form
  const registerSave = useCallback((fn: (andClose: boolean) => Promise<void>) => {
    saveCallbackRef.current = fn;
  }, []);

  // Trigger save
  const triggerSave = useCallback(async (andClose: boolean) => {
    if (!saveCallbackRef.current || isSaving) return;
    setIsSaving(true);
    try {
      await saveCallbackRef.current(andClose);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // CMD+S / Ctrl+S → Save
      if (modKey && e.key === "s" && !e.shiftKey && isEditing) {
        e.preventDefault();
        triggerSave(false);
        return;
      }
      // CMD+Shift+S / Ctrl+Shift+S → Save & Close
      if (modKey && e.shiftKey && e.key === "S" && isEditing) {
        e.preventDefault();
        triggerSave(true);
        return;
      }
      // Alt+← → Previous navigation
      if (e.altKey && e.key === "ArrowLeft" && prevId) {
        e.preventDefault();
        router.push(`${basePath}/${prevId}/edit`);
        return;
      }
      // Alt+→ → Next navigation
      if (e.altKey && e.key === "ArrowRight" && nextId) {
        e.preventDefault();
        router.push(`${basePath}/${nextId}/edit`);
        return;
      }
      // E → Enable edit mode (outside form fields)
      if (e.key === "e" && !isEditing && document.activeElement?.tagName === "BODY") {
        setIsEditing(true);
        return;
      }
      // Esc → Cancel editing
      if (e.key === "Escape" && isEditing) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditing, isSaving, prevId, nextId, basePath, router, triggerSave]);

  const contextValue = {
    isEditing,
    setIsEditing,
    targetId,
    registerSave,
    triggerSave,
  };

  return (
    <EntityFrameContext.Provider value={contextValue}>
      {/* Sticky Header */}
      <header className="
        sticky top-0 z-30
        flex items-center justify-between
        px-6 py-3
        bg-background/95 backdrop-blur-sm
        border-b border-border/50
      ">
        {/* Breadcrumb (injected from server EntityFrame) */}
        <div className="flex items-center">
          {headerSlot}
          {/* Sequential navigation arrows */}
          {(prevId !== null || nextId !== null) && (
            <NavArrows prevId={prevId} nextId={nextId} basePath={basePath} />
          )}
        </div>

        {/* Edit mode badge */}
        {isEditing && (
          <span className="
            text-[10px] font-semibold uppercase tracking-wider
            px-2 py-0.5 rounded-full
            bg-primary/10 text-primary border border-primary/20
            animate-in fade-in duration-200
          ">
            Edit Mode
          </span>
        )}
      </header>

      {/* Main — page content (title + form) */}
      <main className="flex-1 animate-in fade-in duration-500">
        {mainSlot}
      </main>

      {/* Floating Dock */}
      <DockBar>
        <EntityDock
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={() => setIsEditing(true)}
          onSave={() => triggerSave(false)}
          onSaveAndClose={() => triggerSave(true)}
          onCancel={() => setIsEditing(false)}
          creationMode={creationMode}
          submitFormId={submitFormId}
        />
      </DockBar>

      {/* Slot for additional children (BethTrigger, etc.) */}
      {children}
    </EntityFrameContext.Provider>
  );
}
