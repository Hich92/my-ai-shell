"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, StickyNote, Lock } from "lucide-react";
import { getNotes, createNote, NoteRow } from "@/modules/core/actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formate une date en français compact : "12 avr. 2026, 14:35" */
function formatFR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Génère 2 initiales pseudo-stables à partir d'un UUID auteur */
function initialsFromUUID(uuid: string | null): string {
  if (!uuid) return "?";
  // On prend les 2 premiers caractères hex en majuscule
  return uuid.replace(/-/g, "").slice(0, 2).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NotesTabProps {
  /** UUID de l'entité cible. Si absent, le mode "hors contexte" affiche un message. */
  targetId?: string;
}

export function NotesTab({ targetId }: NotesTabProps) {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chargement initial depuis la DB
  useEffect(() => {
    if (!targetId) {
      setIsInitialized(true);
      return;
    }
    setIsInitialized(false);
    getNotes(targetId).then((rows) => {
      setNotes(rows);
      setIsInitialized(true);
    });
  }, [targetId]);

  // Auto-scroll en bas à chaque nouvel ajout
  useEffect(() => {
    if (isInitialized) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes, isInitialized]);

  const handleAddNote = () => {
    const text = input.trim();
    if (!text || !targetId || isLoading || isPending) return;

    // Ajout optimiste local immédiat
    const optimistic: NoteRow = {
      id: `opt-${Date.now()}`,
      target_id: targetId,
      target_schema: "sys_org.m_entities",
      author_id: null,
      content: text,
      is_internal: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    setNotes((prev) => [optimistic, ...prev]);
    setInput("");

    startTransition(async () => {
      const saved = await createNote(targetId, text);
      if (saved) {
        // Remplace l'optimiste par la vraie ligne DB
        setNotes((prev) =>
          prev.map((n) => (n.id === optimistic.id ? saved : n))
        );
      } else {
        // Rollback silencieux
        setNotes((prev) => prev.filter((n) => n.id !== optimistic.id));
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddNote();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (!targetId) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-2 p-6 text-center">
        <StickyNote className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Ouvrez une fiche entité pour accéder aux notes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 px-4 py-3">
        {/* État de chargement */}
        {!isInitialized && (
          <div className="flex justify-center py-8 text-xs text-muted-foreground animate-pulse">
            Chargement des notes…
          </div>
        )}

        {/* Liste vide */}
        {isInitialized && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <StickyNote className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucune note pour cette entité.</p>
            <p className="text-xs text-muted-foreground/70">Ajoutez la première note ci-dessous.</p>
          </div>
        )}

        {/* Timeline de notes */}
        {isInitialized && notes.length > 0 && (
          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-3 group">
                {/* Avatar auteur */}
                <div className="shrink-0 h-8 w-8 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                  {initialsFromUUID(note.author_id)}
                </div>

                {/* Bulle */}
                <div className="flex-1 min-w-0">
                  {/* Méta : date + badge is_internal */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {formatFR(note.created_at)}
                    </span>
                    {note.is_internal && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1.5 text-[9px] gap-0.5 font-medium"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        Interne
                      </Badge>
                    )}
                  </div>
                  {/* Contenu */}
                  <div
                    className={`
                      bg-muted/60 border border-border/60
                      rounded-xl rounded-tl-sm px-3 py-2
                      text-sm text-foreground leading-relaxed whitespace-pre-wrap
                      transition-opacity duration-300
                      ${note.id.startsWith("opt-") ? "opacity-60" : "opacity-100"}
                    `}
                  >
                    {note.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Zone de saisie */}
      <div className="shrink-0 p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            id="notes-input"
            placeholder="Ajouter une note…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className="flex-1 h-9 text-sm rounded-full bg-muted/50 border-muted-foreground/20 px-4"
          />
          <Button
            id="notes-send-btn"
            size="icon"
            className="shrink-0 h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
            onClick={handleAddNote}
            disabled={!input.trim() || isPending}
            aria-label="Envoyer la note"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
