"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEntityFrame } from "@/components/layout/entity-frame-context";
import { Badge } from "@/components/ui/badge";
import { updateContactInPlace } from "@/modules/contacts/actions";
import type { EntityContact, CompanyOption } from "@/modules/contacts/actions";

interface ContactEditFormProps {
  contact: EntityContact;
  companies: CompanyOption[];
}

/**
 * ContactEditForm — Client Component.
 * Consomme le contexte EntityFrame pour réagir à isEditing.
 * Enregistre son callback de sauvegarde via registerSave.
 */
export function ContactEditForm({ contact, companies }: ContactEditFormProps) {
  const { isEditing, registerSave } = useEntityFrame();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Recording the save callback in the Shell
  useEffect(() => {
    registerSave(async (andClose: boolean) => {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);

      await new Promise<void>((resolve) => {
        startTransition(async () => {
          const result = await updateContactInPlace(contact.id, formData);
          if (result.success) {
            toast.success(
              andClose
                ? "Entity saved successfully."
                : `"${result.updatedFields?.name ?? "Entity"}" updated.`,
              { duration: 3000 }
            );
            if (andClose) {
              router.push("/contacts");
            }
          } else {
            toast.error(result.error ?? "Error during save.", { duration: 5000 });
          }
          resolve();
        });
      });
    });
  }, [contact.id, registerSave, router]);

  const disabled = !isEditing || isPending;

  return (
    <form
      id="edit-contact-form"
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="space-y-10"
    >
      {/* Status & Type (Luxe Badges) */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left-2 duration-1000">
        {contact.is_company ? (
          <Badge className="bg-foreground text-background border-none">B2B / COMPANY</Badge>
        ) : (
          <Badge variant="outline" className="border-border text-muted-foreground">INDIVIDUAL</Badge>
        )}
        <Badge variant="outline" className="border-border/40 text-[8px] opacity-50 uppercase tracking-widest font-light">
          ID: {contact.id.split('-')[0]}...
        </Badge>
      </div>

      {/* Entity Name */}
      <div className="space-y-3">
        <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Official Designation
        </Label>
        <Input
          id="edit-name"
          name="name"
          defaultValue={contact.name}
          placeholder="Designation..."
          required
          disabled={disabled}
          className="border-border/40 focus-visible:border-foreground transition-all"
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Point</Label>
          <Input
            id="edit-email"
            name="email"
            type="email"
            defaultValue={contact.email || ""}
            placeholder="email@domain.com"
            disabled={disabled}
            className="border-border/40 focus-visible:border-foreground"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="edit-phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Line</Label>
          <Input
            id="edit-phone"
            name="phone"
            defaultValue={contact.phone || ""}
            placeholder="+33..."
            disabled={disabled}
            className="border-border/40 focus-visible:border-foreground"
          />
        </div>
      </div>

      {/* B2B Company Checkbox - Minimalist */}
      <div className={`
        flex items-center space-x-3 py-4 border-y border-border/20
        transition-opacity duration-300
        ${disabled ? "opacity-40" : ""}
      `}>
        <input
          type="checkbox"
          id="is_company"
          name="is_company"
          defaultChecked={contact.is_company}
          disabled={disabled}
          className="w-3.5 h-3.5 accent-foreground rounded-sm border-border cursor-pointer transition-all"
        />
        <Label
          htmlFor="is_company"
          className="text-[11px] font-light tracking-wide uppercase cursor-pointer"
        >
          Declare as professional B2B structure
        </Label>
      </div>

      {/* Parent Company Association */}
      <div className="space-y-3 border-l-2 border-border/10 pl-6 py-2">
        <Label htmlFor="edit-parent" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Corporate Parent</Label>
        <select
          id="edit-parent"
          name="parent_id"
          defaultValue={contact.parent_id || ""}
          disabled={disabled}
          className="flex h-10 w-full rounded-sm border border-border/40 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground disabled:opacity-40 transition-all appearance-none cursor-pointer"
        >
          <option value="">— Independent —</option>
          {companies.map((company: CompanyOption) => (
            <option key={company.id} value={company.id}>
              {company.name.toUpperCase()}
            </option>
          ))}
        </select>
        <p className="text-[9px] font-light italic text-muted-foreground/60 tracking-tight">
          {isEditing
            ? "Entity can be attached to a parent structure for consolidation."
            : "Read-only navigation."}
        </p>
      </div>
    </form>
  );
}
