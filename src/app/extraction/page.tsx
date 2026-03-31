import ListingModule from "@/components/modules/listing-form";

export default function ExtractionPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Liste Documents</h1>
        <p className="text-muted-foreground italic mt-2">Suivi et état des extractions.</p>
      </div>
      <div className="w-full max-w-5xl bg-card border-border shadow-sm rounded-xl p-8">
        <ListingModule />
      </div>
    </div>
  );
}
