import IngestionModule from "@/components/modules/ingestion-form";

export default function IngestionPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ingestion</h1>
        <p className="text-muted-foreground italic mt-2">Dépôt de documents pour le traitement IA.</p>
      </div>
      <div className="w-full">
        <IngestionModule />
      </div>
    </div>
  );
}
