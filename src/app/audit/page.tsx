"use client";

import { useEffect, useState, useRef } from "react";
import { getAppLogs } from "@/lib/system-service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, RefreshCcw, Terminal, FileText } from "lucide-react";

export default function AuditPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAppLogs();
      setLogs(data);
    } catch (error) {
      console.error(error);
      setLogs(["[ERROR] Impossible de récupérer les logs du cluster d'intelligence artificielle."]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Défilement automatique de la console vers le bas lorsqu'il y a de nouveaux logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit & Logs</h1>
        <p className="text-muted-foreground italic mt-2">Traçabilité complète des accès et processus techniques.</p>
      </div>

      {/* Section : Gestion de l'Audit (Fonctionnalités "Future-Proof") */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Gestion de l&apos;Audit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="opacity-50 cursor-not-allowed bg-card shadow-sm border-dashed">
            <CardHeader className="pb-3 relative">
              <Badge variant="secondary" className="absolute top-4 right-4 text-[10px] uppercase font-semibold">Prochainement</Badge>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                 <FileText className="h-5 w-5 text-muted-foreground" />
                 Rapports de conformité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">Génération automatisée et sécurisée des rapports règlementaires (RGPD, ISO 27001).</p>
            </CardContent>
          </Card>
          
          <Card className="opacity-50 cursor-not-allowed bg-card shadow-sm border-dashed">
            <CardHeader className="pb-3 relative">
               <Badge variant="secondary" className="absolute top-4 right-4 text-[10px] uppercase font-semibold">Prochainement</Badge>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                 <Lock className="h-5 w-5 text-muted-foreground" />
                 Historique des connexions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">Traçabilité avancée des adresses IP, des sessions utilisateurs et des révocations de droits.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section : Console Système */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Console Système Live
            </h2>
            <Button onClick={fetchLogs} disabled={isLoading} variant="outline" size="sm" className="gap-2 bg-background shadow-sm hover:shadow-md transition-shadow">
              <RefreshCcw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Synchronisation...' : 'Rafraîchir les logs'}
            </Button>
         </div>
         
         {/* Fenêtre de terminal */}
         <div className="rounded-lg overflow-hidden border border-border shadow-xl bg-background flex flex-col h-[400px]">
           {/* Barre d'entête typée macOS / Linux */}
           <div className="bg-muted border-b border-border px-4 py-3 flex items-center gap-2 shrink-0">
              <div className="flex gap-2">
                 <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                 <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                 <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-muted-foreground ml-4 font-mono font-medium tracking-wide">/var/log/ai-shell/backend_stream.log</span>
           </div>
           
           <div 
             ref={scrollRef}
             className="flex-1 p-5 overflow-auto font-mono text-sm leading-relaxed"
           >
             {isLoading && logs.length === 0 ? (
               <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="animate-pulse">_</span> Montage de la sonde distante...
               </div>
             ) : (
               <div className="flex flex-col gap-1.5">
                 {logs.map((log, i) => (
                   <div key={i} className="break-all whitespace-pre-wrap">
                     {log.includes('[INFO]') ? (
                        <span className="text-blue-400 mr-2 font-semibold">[INFO]</span>
                     ) : log.includes('[WARN]') ? (
                        <span className="text-yellow-400 mr-2 font-semibold">[WARN]</span>
                     ) : log.includes('[ERROR]') ? (
                        <span className="text-red-400 mr-2 font-semibold">[ERROR]</span>
                     ) : log.includes('[DEBUG]') ? (
                        <span className="text-emerald-400 mr-2 font-semibold">[DEBUG]</span>
                     ) : null}
                     <span className="text-foreground/80">
                       {log.replace(/\[(INFO|WARN|ERROR|DEBUG)\] /g, '')}
                     </span>
                   </div>
                 ))}
                 {!isLoading && (
                    <div className="mt-4 text-muted-foreground/60 animate-pulse font-bold">
                      _
                    </div>
                 )}
               </div>
             )}
           </div>
         </div>
      </div>
    </div>
  );
}
