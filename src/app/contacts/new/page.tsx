import { createContact, getCompanies, CompanyOption } from "@/modules/contacts/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { EntityFrame } from "@/components/layout/entity-frame";

export default async function NewContactPage() {
  const companies = await getCompanies();

  return (
    <EntityFrame
      title="New Entity"
      subtitle="Creation · sys_org schema"
      breadcrumb={[
        { label: "Contacts", href: "/contacts" },
        { label: "New Contact", href: "#" },
      ]}
      icon={UserPlus}
      creationMode={true}
      submitFormId="new-contact-form"
    >
      {/* ──────────────────────────────────────────
          FORM (ID linked to Dock buttons via Shell)
      ────────────────────────────────────────── */}
      <form id="new-contact-form" action={createContact} className="space-y-6">

        {/* Entity Name */}
        <div className="space-y-2">
          <Label htmlFor="new-name">Entity Name *</Label>
          <Input
            id="new-name"
            name="name"
            placeholder="e.g. Acme Corp..."
            required
            autoFocus
            className="bg-muted/50 focus-visible:ring-1"
          />
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">Contact Email</Label>
            <Input
              id="new-email"
              name="email"
              type="email"
              placeholder="hello@acme.com"
              className="bg-muted/50 focus-visible:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-phone">Direct Line</Label>
            <Input
              id="new-phone"
              name="phone"
              placeholder="+33 1 00 00 00 00"
              className="bg-muted/50 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* B2B Company Checkbox */}
        <div className="flex items-center space-x-3 border border-primary/15 rounded-lg p-4 bg-accent/50">
          <input
            type="checkbox"
            id="is_company"
            name="is_company"
            className="w-4 h-4 accent-primary rounded cursor-pointer"
          />
          <Label htmlFor="is_company" className="text-sm font-semibold leading-none cursor-pointer">
            Declare this entity as a Professional Company (B2B)
          </Label>
        </div>

        {/* Parent Company Association */}
        <div className="space-y-2">
          <Label htmlFor="new-parent">Parent Association (Optional)</Label>
          <select
            id="new-parent"
            name="parent_id"
            className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">— No Association —</option>
            {companies.map((company: CompanyOption) => (
              <option key={company.id} value={company.id}>
                🏢 {company.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            If the entity is an individual working for an existing company, please select it.
          </p>
        </div>

        {/* Accessible fallback button */}
        <button type="submit" className="sr-only" aria-hidden="true">
          Create Entity
        </button>
      </form>
    </EntityFrame>
  );
}
