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
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground opacity-50">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-muted-foreground">Contacts Archives</h1>
            <p className="text-muted-foreground/70 text-xs uppercase tracking-widest">Inactive storage registry (soft deletes).</p>
          </div>
        </div>
        
        <Button variant="outline" asChild className="h-8 text-[10px] uppercase font-black tracking-[0.2em] border-zinc-200/50 dark:border-zinc-800/50">
          <Link href="/contacts">
            <ChevronLeft className="mr-2 h-3.5 w-3.5" /> Back to Active
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-border/40 bg-zinc-50/30 dark:bg-zinc-950/30">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Suspended Entities</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center p-16 text-muted-foreground border rounded-lg border-dashed border-border/20 bg-muted/5 opacity-50">
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">No contacts in archives yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border border-border/40 overflow-hidden opacity-80 grayscale">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10">
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Entity Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact: EntityContact) => (
                      <TableRow key={contact.id} className="border-b border-border/10">
                        <TableCell>
                          {contact.is_company ? (
                            <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-900/50 dark:text-zinc-100/50 max-w-fit" title="Company">
                              <Building2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-zinc-50 dark:bg-zinc-950 text-muted-foreground/50 max-w-fit" title="Individual">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                            {contact.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{contact.email || "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{contact.phone || "—"}</TableCell>
                        <TableCell className="text-right">
                          <form action={restoreContact}>
                            <input type="hidden" name="id" value={contact.id} />
                            <Button size="sm" variant="ghost" className="h-7 text-[9px] uppercase font-bold tracking-widest text-zinc-400 hover:text-foreground">
                              <RefreshCcw className="h-3 w-3 mr-2" /> Restore
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
                <div className="flex items-center justify-between px-2 pt-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-black tracking-widest" disabled={currentPage <= 1} asChild={currentPage > 1}>
                      {currentPage > 1 ? (
                        <Link href={`/contacts/archive?page=${currentPage - 1}`}>
                          <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                        </Link>
                      ) : (
                        <span><ChevronLeft className="h-3 w-3 mr-1" /> Previous</span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-black tracking-widest" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                      {currentPage < totalPages ? (
                        <Link href={`/contacts/archive?page=${currentPage + 1}`}>
                          Next <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      ) : (
                        <span>Next <ChevronRight className="h-3 w-3 ml-1" /></span>
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
