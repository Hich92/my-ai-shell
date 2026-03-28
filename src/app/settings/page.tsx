import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground italic mt-2">Configurations système et sécurité.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
         <div className="w-[200px] flex-shrink-0 flex flex-col gap-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
         </div>
         <div className="flex-1 space-y-6">
             <Skeleton className="h-[150px] w-full rounded-xl" />
             <Skeleton className="h-[250px] w-full rounded-xl" />
         </div>
      </div>
    </div>
  );
}
