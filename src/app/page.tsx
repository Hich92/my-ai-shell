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
  Settings,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const apps = [
  { name: "Contacts", icon: Users, href: "/contacts", isFuture: false },
  { name: "Ingestion", icon: UploadCloud, href: "/ingestion", isFuture: true },
  { name: "Documents", icon: ListTodo, href: "/extraction", isFuture: true },
  { name: "Validation", icon: CheckCircle, href: "/validation", isFuture: true },
  { name: "Espaces", icon: FolderKanban, href: "/projects", isFuture: true },
  { name: "Modèles", icon: FileSearch, href: "/models", isFuture: true },
  { name: "Audit & Logs", icon: ShieldCheck, href: "/audit", isFuture: true },
  { name: "Paramètres", icon: Settings, href: "/settings", isFuture: true },
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
            {apps.map((_, i) => (
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
        <h1 className="text-3xl font-bold tracking-tight text-center mb-12 text-foreground">
          Système Opérationnel
        </h1>

        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {apps.map((app) => {
              const baseCardClass = "group flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative transition-all duration-200";
              const futureClass = "opacity-40 grayscale pointer-events-none border-dashed border-muted";
              const activeClass = "border-primary/20 hover:shadow-md hover:border-primary/50 cursor-pointer";

              const AppCard = (
                <div className={`${baseCardClass} ${app.isFuture ? futureClass : activeClass}`}>
                  {app.isFuture ? (
                    <Badge variant="outline" className="absolute top-3 right-3 text-[10px] px-2 py-0 border-muted text-muted-foreground">Bientôt disponible</Badge>
                  ) : (
                    <Badge variant="default" className="absolute top-3 right-3 text-[10px] px-2 py-0 bg-primary text-primary-foreground hover:bg-primary">Opérationnel</Badge>
                  )}
                  
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-transform ${app.isFuture ? 'bg-muted' : 'bg-primary/10 group-hover:scale-105'}`}>
                    <app.icon className={`h-8 w-8 ${app.isFuture ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <span className={`font-medium text-sm tracking-wide text-center ${app.isFuture ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {app.name}
                  </span>
                </div>
              );

              if (app.isFuture) {
                return (
                  <Tooltip key={app.name}>
                    <TooltipTrigger asChild>
                      {/* Enveloppe span pour permettre le tooltip sur un élément disabled/pointer-events-none */}
                      <span className="w-full cursor-not-allowed">
                        {AppCard}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-center border-primary/20 bg-background/95 backdrop-blur">
                      <p>Ce module est en cours de déploiement systémique.</p>
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
        </TooltipProvider>
      </div>
    </div>
  );
}