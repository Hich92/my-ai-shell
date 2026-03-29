import { getContacts, EntityContact, restoreContact } from "@/modules/contacts/actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, User, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ArchiveContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;
  const { data: contacts, totalPages } = await getContacts(currentPage, 10, false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-muted-foreground">Archives Contacts</h1>
            <p className="text-muted-foreground/70">Registre de l'espace de stockage inactif (soft deletes).</p>
          </div>
        </div>
        
        <Button variant="outline" asChild>
          <Link href="/contacts">
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux Actifs
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-muted/60 opacity-90">
        <CardHeader>
          <CardTitle className="text-lg">Entités Suspendues</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed bg-muted/20">
              Aucun contact dans les archives pour l'instant.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Nom de l'entité</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact: EntityContact) => (
                      <TableRow key={contact.id} className="bg-muted/10">
                        <TableCell>
                          {contact.is_company ? (
                            <div className="p-1 rounded bg-blue-100/50 text-blue-700/50 max-w-fit" title="Société">
                              <Building2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-slate-100/50 text-slate-700/50 max-w-fit" title="Individu">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                            {contact.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{contact.email || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{contact.phone || "—"}</TableCell>
                        <TableCell className="text-right">
                          <form action={restoreContact}>
                            <input type="hidden" name="id" value={contact.id} />
                            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                              <RefreshCcw className="h-4 w-4 mr-2" /> Restaurer
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
                      {currentPage > 1 ? (
                        <Link href={`/contacts/archive?page=${currentPage - 1}`}>
                          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                        </Link>
                      ) : (
                        <span><ChevronLeft className="h-4 w-4 mr-1" /> Précédent</span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                      {currentPage < totalPages ? (
                        <Link href={`/contacts/archive?page=${currentPage + 1}`}>
                          Suivant <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      ) : (
                        <span>Suivant <ChevronRight className="h-4 w-4 ml-1" /></span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
