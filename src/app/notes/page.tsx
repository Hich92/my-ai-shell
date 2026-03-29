import { getNotes, addNote } from "@/modules/notes/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote } from "lucide-react";

export default async function NotesPage() {
  // Pré-chargement des données côté serveur
  const notes = await getNotes();

  // Definition d'une Server Action in-line pour adapter le form à addNote
  async function handleAddNote(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    await addNote(content);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <StickyNote className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pense-bête</h1>
          <p className="text-muted-foreground">Test de résilience de la base Postgres 17 (CRUD pur).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-muted/60 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Nouvelle Note</CardTitle>
            <CardDescription>Enregistrement direct en base de données.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleAddNote} className="space-y-4 flex flex-col">
              <Input 
                name="content" 
                placeholder="Votre idée..." 
                required 
                autoFocus
                className="bg-muted/50 focus-visible:ring-1"
              />
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-muted/60">
          <CardHeader>
            <CardTitle className="text-lg">Historique Mémorisé</CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed bg-muted/20">
                Aucune note enregistrée pour le moment.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead>Contenu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notes.map((note: { id: string; content: string; createdAt: Date }) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </TableCell>
                        <TableCell className="font-medium">{note.content}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
