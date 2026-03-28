import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Espaces de travail</h1>
        <p className="text-muted-foreground italic mt-2">Dossiers et projets de traitement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[140px] w-full rounded-xl" />
        <Skeleton className="h-[140px] w-full rounded-xl" />
        <Skeleton className="h-[140px] w-full rounded-xl" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  );
}
