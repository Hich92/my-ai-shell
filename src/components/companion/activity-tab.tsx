"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  StickyNote,
  Activity,
  Filter,
  Plus,
  Pencil,
  Archive,
} from "lucide-react";
import { getActivities, ActivityRow } from "@/modules/core/actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formate une date en français : "12 avr. 2026, 14:35" ou "–" si null */
function formatFR(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Retourne l'icône et les classes couleur selon activity_type */
type IconConfig = { icon: React.ElementType; color: string; bg: string };

function getIconConfig(type: string): IconConfig {
  const t = (type || "").toUpperCase();
  if (t.includes("CALL") || t.includes("PHONE")) return { icon: Phone,       color: "text-emerald-600", bg: "bg-emerald-50" };
  if (t.includes("EMAIL") || t.includes("MAIL"))  return { icon: Mail,        color: "text-sky-600",     bg: "bg-sky-50" };
  if (t.includes("MEETING") || t.includes("RDV")) return { icon: Calendar,    color: "text-violet-600",  bg: "bg-violet-50" };
  if (t.includes("TASK") || t.includes("TODO"))   return { icon: CheckSquare, color: "text-amber-600",   bg: "bg-amber-50" };
  if (t.includes("NOTE"))                          return { icon: StickyNote,  color: "text-rose-600",    bg: "bg-rose-50" };
  if (t.includes("CREATE"))                        return { icon: Plus,        color: "text-primary",     bg: "bg-primary/10" };
  if (t.includes("EDIT") || t.includes("UPDATE")) return { icon: Pencil,      color: "text-amber-600",   bg: "bg-amber-50" };
  if (t.includes("ARCHIVE"))                       return { icon: Archive,     color: "text-muted-foreground", bg: "bg-muted" };
  return { icon: Activity, color: "text-primary", bg: "bg-primary/10" };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ActivityTabProps {
  targetId?: string;
}

export function ActivityTab({ targetId }: ActivityTabProps) {
  // null = chargement en cours, [] = vide, [...] = données
  const [events, setEvents] = useState<ActivityRow[] | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");

  // Chargement depuis la DB — setEvents est appelé uniquement dans la callback async
  useEffect(() => {
    if (!targetId) return;
    setEvents(null); // reset au changement d'entité
    getActivities(targetId).then(setEvents);
  }, [targetId]);

  // Pour l'instant, "Mes actions" = les lignes sans assigned_to
  const rows = events ?? [];
  const filtered = filter === "all" ? rows : rows.filter((e) => !e.assigned_to);

  // ─── States vides / chargement ──────────────────────────────────────────────

  if (!targetId) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-2 p-6 text-center">
        <Activity className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Ouvrez une fiche entité pour accéder au journal.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Barre de filtre */}
      <div className="shrink-0 px-4 pt-3 pb-2 flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
          <Button
            id="activity-filter-all"
            size="sm"
            variant={filter === "all" ? "default" : "ghost"}
            className={`h-7 px-3 text-xs rounded-md transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilter("all")}
          >
            Toutes les activités
          </Button>
          <Button
            id="activity-filter-mine"
            size="sm"
            variant={filter === "mine" ? "default" : "ghost"}
            className={`h-7 px-3 text-xs rounded-md transition-all ${
              filter === "mine"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilter("mine")}
          >
            Mes actions
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {/* Chargement */}
        {events === null && (
          <div className="flex justify-center py-8 text-xs text-muted-foreground animate-pulse">
            Chargement des activités…
          </div>
        )}

        {/* Vide */}
        {events !== null && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {filter === "mine" ? "Aucune de vos actions enregistrée." : "Aucune activité pour cette entité."}
            </p>
          </div>
        )}

        {/* Liste d'événements */}
        {events !== null && filtered.length > 0 && (
          <div className="relative">
            {/* Ligne verticale de timeline */}
            <div className="absolute left-[18px] top-3 bottom-3 w-px bg-border" />

            <div className="flex flex-col">
              {filtered.map((event) => {
                const cfg = getIconConfig(event.activity_type);
                const Icon = cfg.icon;
                const isDone = event.status === "DONE" || event.status === "CANCELLED";

                return (
                  <div key={event.id} className="flex gap-3 py-2.5 group">
                    {/* Icône */}
                    <div
                      className={`
                        relative z-10 shrink-0
                        h-9 w-9 rounded-full border border-border
                        flex items-center justify-center
                        ${cfg.bg} shadow-sm
                        transition-transform duration-150 group-hover:scale-105
                      `}
                    >
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0 pt-1">
                      {/* Titre + badge statut */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-sm font-medium leading-tight ${
                            isDone
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {event.summary}
                        </span>
                        {/* Type tag */}
                        <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70 bg-muted rounded px-1.5 py-0.5 shrink-0 font-medium">
                          {event.activity_type}
                        </span>
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className={`text-xs mt-0.5 leading-relaxed ${isDone ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                          {event.description}
                        </p>
                      )}

                      {/* Due date */}
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium tabular-nums">
                        {event.due_date ? `Échéance : ${formatFR(event.due_date)}` : `Créé : ${formatFR(event.created_at)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
