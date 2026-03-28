import Link from "next/link";
import { 
  UploadCloud, 
  ListTodo, 
  CheckCircle, 
  ShieldCheck, 
  FolderKanban, 
  FileSearch, 
  Settings 
} from "lucide-react";

const apps = [
  { name: "Ingestion", icon: UploadCloud, href: "/ingestion", color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Documents", icon: ListTodo, href: "/extraction", color: "text-indigo-500", bg: "bg-indigo-50" },
  { name: "Validation", icon: CheckCircle, href: "/validation", color: "text-green-500", bg: "bg-green-50" },
  { name: "Espaces", icon: FolderKanban, href: "/projects", color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Modèles", icon: FileSearch, href: "/models", color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Audit & Logs", icon: ShieldCheck, href: "/audit", color: "text-red-500", bg: "bg-red-50" },
  { name: "Paramètres", icon: Settings, href: "/settings", color: "text-slate-500", bg: "bg-slate-50" },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-12 text-slate-800">
          Système Opérationnel
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {apps.map((app) => (
            <Link key={app.name} href={app.href} className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-transparent shadow-sm hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${app.bg} ${app.color}`}>
                <app.icon className="h-8 w-8" />
              </div>
              <span className="font-medium text-slate-700 text-sm tracking-wide">{app.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}