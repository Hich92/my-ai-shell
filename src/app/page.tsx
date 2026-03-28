import IngestionModule from "@/modules/ingestion";
import ListingModule from "@/modules/listing"; // On importe le nouveau module
import ReviewerModule from "@/modules/reviewer"; // Module de révision

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord IA</h1>
        <p className="text-muted-foreground italic mt-2">Système de traitement souverain</p>
      </div>
      
      {/* Module 1 : Envoi */}
      <div className="w-full">
        <IngestionModule />
      </div>
      
      {/* Module 2 : Affichage */}
      <div className="w-full max-w-4xl border-t bg-card border-border shadow-sm rounded-xl p-8 mt-4 mx-auto">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">Documents extraits</h2>
        <ListingModule />
      </div>

      {/* Module 3 : Révision */}
      <div className="w-full max-w-6xl border-t bg-card border-border shadow-sm rounded-xl p-8 mt-4 mx-auto">
        <h2 className="text-xl font-semibold mb-6">Espace Révision</h2>
        <ReviewerModule />
      </div>
    </div>
  );
}