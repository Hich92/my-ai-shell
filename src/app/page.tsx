import IngestionModule from "@/modules/ingestion";
import ListingModule from "@/modules/listing"; // On importe le nouveau module

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24 bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord IA</h1>
        <p className="text-muted-foreground italic">Système de traitement souverain</p>
      </div>
      
      {/* Module 1 : Envoi */}
      <IngestionModule />
      
      {/* Module 2 : Affichage (La nouvelle brique) */}
      <div className="w-full max-w-4xl border-t pt-12">
        <h2 className="text-xl font-semibold mb-6">Documents extraits</h2>
        <ListingModule />
      </div>
    </main>
  );
}