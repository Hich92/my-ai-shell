import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlusCircle, Search, ArchiveRestore, Edit3, Trash2 } from "lucide-react";

export default function ContactsDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b pb-6 border-muted">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Users className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Référentiel Contacts</h1>
          <p className="text-muted-foreground text-lg mt-1">Menu Central systémique (ORG Odoo-grade).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {/* CREATE */}
        <Link href="/contacts/new" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-green-500/50 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 w-full h-1 bg-green-500" />
            <CardHeader>
              <PlusCircle className="h-8 w-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Créer un Contact</CardTitle>
              <CardDescription>Insérer une Entité (Individu ou Société) avec lien parent direct.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* SEARCH / LIST */}
        <Link href="/contacts/list" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-blue-500/50 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 w-full h-1 bg-blue-500" />
            <CardHeader>
              <Search className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Registre Global</CardTitle>
              <CardDescription>Parcourir la base des entités actives avec recherche SQL native (ILIKE).</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* ARCHIVE */}
        <Link href="/contacts/archive" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-purple-500/50 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 w-full h-1 bg-purple-500" />
            <CardHeader>
              <ArchiveRestore className="h-8 w-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Salle des Archives</CardTitle>
              <CardDescription>Zone de stockage froid des entités suspendues (Soft-deletes).</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* EDIT FACTICE (GHOST) */}
        <Card className="h-full opacity-50 border-dashed cursor-not-allowed group">
          <CardHeader>
            <Edit3 className="h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle className="text-xl text-muted-foreground line-through decoration-muted">Modification / UPDATE</CardTitle>
            <CardDescription>L'édition systémique s'effectue dynamiquement en cliquant sur le "Crayon" présent sur les lignes du Registre Global ([id]/edit).</CardDescription>
          </CardHeader>
        </Card>

        {/* DELETE FACTICE (GHOST) */}
        <Card className="h-full opacity-50 border-dashed cursor-not-allowed group">
          <CardHeader>
            <Trash2 className="h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle className="text-xl text-muted-foreground line-through decoration-muted">Archivage / DELETE</CardTitle>
            <CardDescription>L'archivage d'une entité s'opère par clic directionnel sur l'action "Archive" au bout de sa ligne dans le Registre Global.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
