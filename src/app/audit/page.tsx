import { Skeleton } from "@/components/ui/skeleton";

export default function AuditPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit & Logs</h1>
        <p className="text-muted-foreground italic mt-2">Traçabilité complète des accès et processus souverains.</p>
      </div>

      <Skeleton className="h-12 w-full rounded-t-xl mt-8" />
      <Skeleton className="h-[600px] w-full rounded-b-xl" />
    </div>
  );
}
