"use client";

import { ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  /** The full-bleed list view (Registry Mode) */
  registry: ReactNode;
  /** The specific record content (Entity Mode) */
  entity?: ReactNode;
  /** Title for the entity header */
  entityTitle?: string;
  /** Subtitle context for the entity header */
  entitySubtitle?: string;
}

/**
 * PageShell - The Dynamic Rendering Framework for AI Shell OS
 * 
 * Switches between Registry (Table) and Entity (Details) states based on ?id={uuid}
 */
export function PageShell({
  registry,
  entity,
  entityTitle = "Record Details",
  entitySubtitle = "sys_org.entity_view",
}: PageShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeId = searchParams.get("id");
  const mode = searchParams.get("mode") || "view";

  const isEntityMode = !!activeId;

  // Handler to clear entity view and return to registry
  const closeEntity = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("mode");
    router.push(`?${params.toString()}`);
  };

  // Toggle between view and edit mode
  const toggleEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode === "edit" ? "view" : "edit");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* ── STATE A : REGISTRY VIEW (LIST) ────────────────────────────────── */}
      {!isEntityMode && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full p-6 md:p-8">
           {registry}
        </div>
      )}

      {/* ── STATE B : ENTITY VIEW (DETAILS / EDIT) ────────────────────────── */}
      {isEntityMode && (
        <div className="flex-1 flex flex-col lg:flex-row h-full animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
          
          {/* MAIN COLUMN */}
          <main className="flex-1 border-r bg-background/50 overflow-y-auto">
            
            {/* Entity Header - Consistent with Search-Centric Vision */}
            <div className="h-20 border-b flex items-center justify-between px-6 md:px-10 sticky top-0 bg-background/80 backdrop-blur z-20">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={closeEntity} className="rounded-full shadow-none hover:bg-muted">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-xl font-bold tracking-tight lowercase">
                     {entityTitle}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    {entitySubtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant={mode === "edit" ? "default" : "outline"}
                  size="sm"
                  className="gap-2 font-bold px-4"
                  onClick={toggleEdit}
                >
                  <Edit className="h-3.5 w-3.5" />
                  {mode === "edit" ? "LOCK RECORD" : "EDIT ENTITY"}
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-8 w-full justify-start border-b rounded-none h-12 bg-transparent p-0 gap-8">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all uppercase text-[10px] font-bold tracking-widest"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="metadata"
                    className="rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent transition-all uppercase text-[10px] font-bold tracking-widest"
                  >
                    Context Metadata
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0 focus-visible:ring-0">
                  <div className="space-y-8">
                     {entity ? entity : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {[1,2,3,4,5,6].map(i => (
                              <Card key={i} className="bg-muted/30 border-none shadow-none">
                                <CardContent className="p-4 space-y-2">
                                  <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
                                  <div className="h-4 w-32 bg-muted-foreground/10 rounded" />
                                </CardContent>
                              </Card>
                           ))}
                        </div>
                     )}
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="mt-0 opacity-50">
                  <div className="py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                    Secondary Metadata Stream Offline
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* SIDEBAR LOGS / ACTIVITY */}
          <aside className="w-full lg:w-80 xl:w-96 border-l bg-muted/10 p-6 overflow-y-auto hidden lg:block">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                Process Log Stream
              </h3>
              
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="p-3 rounded border border-dashed border-muted-foreground/20 bg-muted/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary italic uppercase tracking-tighter">sys_trace</span>
                      <span className="text-[8px] text-muted-foreground tabular-nums">23:44:0{i}</span>
                    </div>
                    <div className="h-2 w-full bg-muted-foreground/10 rounded-sm" />
                    <div className="h-2 w-3/4 bg-muted-foreground/5 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
