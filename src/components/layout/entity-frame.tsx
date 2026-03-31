import { type ReactNode, Fragment } from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EntityFrameShell } from "@/components/layout/entity-frame-shell";
import { BethTrigger } from "@/components/layout/beth-trigger";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface BreadcrumbEntry {
  label: string;
  href: string;
}

interface EntityFrameProps {
  /** Titre principal de la fiche (ex: nom du contact) */
  title: string;
  /** Sous-titre contextuel (ex: UUID, date de création) */
  subtitle: string;
  /** Fil d'Ariane — le dernier item est toujours la page courante */
  breadcrumb: BreadcrumbEntry[];
  /** Icône Lucide affichée à gauche du titre */
  icon: LucideIcon;
  /** Contenu de la Card centrale (formulaire, détails…) */
  children: ReactNode;
  /** UUID de l'entité courante — contextualise le Compagnon (Notes, Activité) */
  targetId?: string;
  /** UUID de l'entité précédente (nav séquentielle) */
  prevId?: string | null;
  /** UUID de l'entité suivante (nav séquentielle) */
  nextId?: string | null;
  /** Chemin de base pour la navigation, ex: "/contacts" */
  basePath?: string;
  /** Mode création : le Dock affiche un bouton submit unique */
  creationMode?: boolean;
  /** ID du formulaire à soumettre (mode création) */
  submitFormId?: string;
}

// ─────────────────────────────────────────────
// EntityFrame — Server Component
// ─────────────────────────────────────────────
export function EntityFrame({
  title,
  subtitle,
  breadcrumb,
  icon: Icon,
  children,
  targetId,
  prevId,
  nextId,
  basePath = "/contacts",
  creationMode = false,
  submitFormId,
}: EntityFrameProps) {
  const parentItems = breadcrumb.slice(0, -1);
  const currentItem = breadcrumb[breadcrumb.length - 1];

  // ── Slot Header : Breadcrumb (rendu côté serveur, injecté dans le Shell)
  const headerSlot = (
    <Breadcrumb>
      <BreadcrumbList>
        {parentItems.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        {currentItem && (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentItem.label}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  // ── Slot Main : Titre + Card (rendu côté serveur)
  const mainSlot = (
    <div className="max-w-3xl mx-auto px-6 md:px-8 pt-16 pb-40 space-y-12">
      {/* En-tête de l'entité : Icon + Titre + Sous-titre */}
      <div className="flex items-center gap-6">
        <div className="
          shrink-0
          h-10 w-10
          border-[0.5px] border-border
          flex items-center justify-center
          rounded-none
        ">
          <Icon className="h-4 w-4 text-foreground" strokeWidth={1} />
        </div>
        <div className="space-y-0">
          <h1 className="text-3xl font-black tracking-tighter text-foreground leading-none uppercase">
            {title}
          </h1>
          <p className="text-[10px] text-muted-foreground font-light tracking-[0.3em] uppercase mt-2 opacity-50">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Card Luxe Épuré */}
      <Card className="
        border-[0.5px] border-border
        shadow-[0_10px_50px_rgba(0,0,0,0.03)]
        bg-card rounded-none
      ">
        <CardContent className="p-12">
          {children}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <EntityFrameShell
      targetId={targetId}
      prevId={prevId}
      nextId={nextId}
      basePath={basePath}
      creationMode={creationMode}
      submitFormId={submitFormId}
      headerSlot={headerSlot}
      mainSlot={mainSlot}
    >
      {/* BETH — Widget flottant en bas à droite */}
      <BethTrigger targetId={targetId} />
    </EntityFrameShell>
  );
}
