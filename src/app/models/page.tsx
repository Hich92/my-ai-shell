import { Skeleton } from "@/components/ui/skeleton";

export default function ModelsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modèles d'Extraction</h1>
        <p className="text-muted-foreground italic mt-2">Entraînement et supervision des IA sectorielles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>

      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  );
}
