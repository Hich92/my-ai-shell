"use client";

import { useRouter } from "next/navigation";
import { Building2, User as UserIcon, Mail, Phone, Link2 } from "lucide-react";
import type { EntityContact } from "@/modules/contacts/actions";

interface FieldProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ElementType;
  onDoubleClick: () => void;
}

/** A single read-only field. Double-click activates edit mode. */
function ReadOnlyField({ label, value, icon: Icon, onDoubleClick }: FieldProps) {
  // "No Noise" rule: hide field entirely if value is falsy
  if (!value) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      title="Double-click to edit"
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => e.key === "Enter" && onDoubleClick()}
      className="
        group flex flex-col gap-1
        px-0 py-4
        border-b-[0.5px] border-border/40
        cursor-text select-text
        hover:bg-accent/30 transition-colors rounded-sm px-2 -mx-2
      "
    >
      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
        {Icon && <Icon className="h-3 w-3" strokeWidth={1.5} />}
        {label}
      </span>
      <span className="text-sm font-light tracking-wide text-foreground">
        {value}
      </span>
      <span className="text-[8px] font-black uppercase tracking-widest text-primary/0 group-hover:text-primary/40 transition-colors">
        Double-click to edit ↗
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ContactDetailsViewProps {
  contact: EntityContact;
  contactId: string;
}

export function ContactDetailsView({ contact, contactId }: ContactDetailsViewProps) {
  const router = useRouter();

  const goToEdit = () => {
    router.push(`/contacts/${contactId}?mode=edit`);
  };

  return (
    <div className="space-y-0">
      {/* Entity type badge */}
      <div className="flex items-center gap-3 pb-6 mb-4 border-b-[0.5px] border-border/40">
        <div className="h-9 w-9 border-[0.5px] border-border flex items-center justify-center bg-muted shrink-0">
          {contact.is_company ? (
            <Building2 className="h-4 w-4 text-foreground/60" strokeWidth={1} />
          ) : (
            <UserIcon className="h-4 w-4 text-foreground/60" strokeWidth={1} />
          )}
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
            {contact.is_company ? "Professional Entity (B2B)" : "Individual Contact"}
          </span>
          <p className="text-[10px] font-light text-muted-foreground/40 tracking-widest uppercase mt-0.5">
            UUID · {contactId}
          </p>
        </div>
      </div>

      {/* Fields - "No Noise" hides empty ones */}
      <ReadOnlyField
        label="Entity Name"
        value={contact.name}
        onDoubleClick={goToEdit}
      />
      <ReadOnlyField
        label="Email"
        value={contact.email}
        icon={Mail}
        onDoubleClick={goToEdit}
      />
      <ReadOnlyField
        label="Direct Line"
        value={contact.phone}
        icon={Phone}
        onDoubleClick={goToEdit}
      />
      <ReadOnlyField
        label="Parent Association"
        value={contact.parent_name ?? null}
        icon={Link2}
        onDoubleClick={goToEdit}
      />

      {/* Created at (always visible, not editable) */}
      <div className="py-4 border-b-[0.5px] border-border/40">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30">
          Created
        </span>
        <p className="text-[11px] font-light text-muted-foreground/40 mt-1 tabular-nums">
          {new Date(contact.created_at).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Global double-click hint */}
      <p className="pt-6 text-[9px] font-light tracking-[0.3em] uppercase text-muted-foreground/20 text-center">
        Double-click any field to edit
      </p>
    </div>
  );
}
