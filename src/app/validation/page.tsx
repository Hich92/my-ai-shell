import ReviewerModule from "@/components/modules/reviewer-form";

export default function ValidationPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Validation</h1>
        <p className="text-muted-foreground italic mt-2">Révisez et corrigez les erreurs d'extraction avant agrégation.</p>
      </div>
      <div className="w-full">
        <ReviewerModule />
      </div>
    </div>
  );
}
