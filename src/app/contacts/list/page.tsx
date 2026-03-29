import { getContacts, EntityContact, archiveContact } from "@/modules/contacts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, User as UserIcon, Archive, Plus, ChevronLeft, ChevronRight, Edit, Search } from "lucide-react";
import Link from "next/link";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;
  const searchQuery = sp.search || "";
  const { data: contacts, totalPages } = await getContacts(currentPage, 10, true, searchQuery);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Référentiel Contacts</h1>
            <p className="text-muted-foreground">Registre global des entités sys_org actives.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/contacts/archive">
              <Archive className="mr-2 h-4 w-4" /> Archives
            </Link>
          </Button>
          <Button asChild>
            <Link href="/contacts/new">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Entité
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-muted/60">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Entités Actives</CardTitle>
          <form className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              name="search"
              defaultValue={searchQuery}
              className="w-full pl-9 focus-visible:ring-1" 
              placeholder="Rechercher par nom..." 
            />
          </form>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed bg-muted/20">
              Aucun contact trouvé.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Nom de l'entité</TableHead>
                      <TableHead>Contact / Rattachement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact: EntityContact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          {contact.is_company ? (
                            <div className="p-1 rounded bg-blue-100 text-blue-700 max-w-fit" title="Société">
                              <Building2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-slate-100 text-slate-700 max-w-fit" title="Individu">
                              <UserIcon className="w-4 h-4" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                            {contact.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm space-y-1">
                          {contact.email && <div className="text-xs">{contact.email}</div>}
                          {contact.phone && <div className="text-xs">{contact.phone}</div>}
                          {contact.parent_name && <div className="text-xs font-semibold text-blue-600">↳ {contact.parent_name}</div>}
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href={`/contacts/${contact.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <form action={archiveContact}>
                            <input type="hidden" name="id" value={contact.id} />
                            <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                              <Archive className="h-4 w-4" />
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
                      {currentPage > 1 ? (
                        <Link href={`/contacts?page=${currentPage - 1}${searchQuery ? '&search='+searchQuery : ''}`}>
                          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                        </Link>
                      ) : (
                        <span><ChevronLeft className="h-4 w-4 mr-1" /> Précédent</span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                      {currentPage < totalPages ? (
                        <Link href={`/contacts?page=${currentPage + 1}${searchQuery ? '&search='+searchQuery : ''}`}>
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
