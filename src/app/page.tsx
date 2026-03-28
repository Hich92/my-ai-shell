import IngestionModule from "@/modules/ingestion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord IA</h1>
      <IngestionModule />
    </main>
  );
}