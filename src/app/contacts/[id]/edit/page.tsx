import { getContactById, updateContact, getCompanies, CompanyOption } from "@/modules/contacts/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Edit3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Récupération de l'ID (UUID string, pas d'entier !)
  const p = await params;
  const contactId = p.id; 
  
  // Sécurité de base sur la présence de l'ID
  if (!contactId) notFound();

  // 2. Récupération des données en parallèle
  const [contact, companies] = await Promise.all([
    getContactById(contactId),
    getCompanies()
  ]);

  // 3. Si l'UUID ne correspond à rien en base, 404 propre
  if (!contact) notFound();

  // 4. Server Action locale pour l'Update
  async function handleUpdateAction(formData: FormData) {
    "use server";
    // On passe l'UUID (string) directement à l'action
    await updateContact(contactId, formData);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/contacts">
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour au Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Modification Entité</h1>
        <p className="text-muted-foreground">Mise à jour d'un contact existant (Update Systémique).</p>
      </div>

      <Card className="shadow-sm border-muted/60 border-t-blue-500 border-t-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <CardTitle>Fiche de {contact.name}</CardTitle>
          </div>
          <CardDescription>Attention, toute modification est tracée dans l'entrepôt d'audit.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l'entité *</label>
              <Input 
                name="name" 
                defaultValue={contact.name} 
                placeholder="Ex: Acme Corp..." 
                required 
                className="bg-muted/50 focus-visible:ring-1" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de contact</label>
                <Input 
                  name="email" 
                  type="email" 
                  defaultValue={contact.email || ""} 
                  placeholder="hello@acme.com" 
                  className="bg-muted/50 focus-visible:ring-1" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ligne directe</label>
                <Input 
                  name="phone" 
                  defaultValue={contact.phone || ""} 
                  placeholder="+33 1 00 00 00 00" 
                  className="bg-muted/50 focus-visible:ring-1" 
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 border border-blue-100 rounded-md p-4 bg-blue-50/50">
              <input 
                type="checkbox" 
                id="is_company" 
                name="is_company" 
                defaultChecked={contact.is_company}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer" 
              />
              <label htmlFor="is_company" className="text-sm font-semibold text-blue-900 leading-none cursor-pointer">
                Déclarer cette entité en tant que Société professionnelle (B2B)
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rattachement Actuel (Société Parente)</label>
              <select 
                name="parent_id" 
                defaultValue={contact.parent_id || ""}
                className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Aucun rattachement --</option>
                {companies.map((company: CompanyOption) => (
                  <option key={company.id} value={company.id}>🏢 {company.name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Modifiez ce champ pour transférer ce collaborateur sous une nouvelle société.
              </p>
            </div>

            <div className="pt-4 border-t border-muted">
              <Button type="submit" className="w-full">
                Appliquer l'UPDATE (Odoo-grade)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}