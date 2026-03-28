"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const apps = [
  { name: "Ingestion", icon: UploadCloud, href: "/ingestion", color: "text-blue-500", bg: "bg-blue-50", isFuture: false },
  { name: "Documents", icon: ListTodo, href: "/extraction", color: "text-indigo-500", bg: "bg-indigo-50", isFuture: false },
  { name: "Validation", icon: CheckCircle, href: "/validation", color: "text-green-500", bg: "bg-green-50", isFuture: false },
  { name: "Espaces", icon: FolderKanban, href: "/projects", color: "text-orange-500", bg: "bg-orange-50", isFuture: true },
  { name: "Modèles", icon: FileSearch, href: "/models", color: "text-purple-500", bg: "bg-purple-50", isFuture: true },
  { name: "Audit & Logs", icon: ShieldCheck, href: "/audit", color: "text-red-500", bg: "bg-red-50", isFuture: false },
  { name: "Paramètres", icon: Settings, href: "/settings", color: "text-slate-500", bg: "bg-slate-50", isFuture: true },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="h-8 w-64 bg-slate-200/50 rounded-md mx-auto mb-12 animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-36 bg-card rounded-2xl shadow-sm animate-pulse border border-transparent"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-12 text-slate-800">
          Système Opérationnel
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {apps.map((app) => {
            const AppCard = (
              <div 
                className={`group flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-transparent shadow-sm relative ${app.isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer'}`}
              >
                {app.isFuture && (
                  <Badge variant="secondary" className="absolute top-3 right-3 text-[10px] px-2 py-0">Bientôt</Badge>
                )}
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-transform ${app.isFuture ? '' : 'group-hover:scale-105'} ${app.bg} ${app.color}`}>
                  <app.icon className="h-8 w-8" />
                </div>
                <span className="font-medium text-slate-700 text-sm tracking-wide text-center">{app.name}</span>
              </div>
            );

            if (app.isFuture) {
              return (
                <Tooltip key={app.name}>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      {AppCard}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Cette application sera disponible prochainement.</span>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link key={app.name} href={app.href} className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl block">
                {AppCard}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}