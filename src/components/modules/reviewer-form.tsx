"use client";

import React, { useEffect, useState } from "react";
import { ExtractedData } from "@/modules/reviewer/types";
import { getExtraction } from "@/modules/reviewer/logic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ReviewerModule({ documentId = "doc-001" }: { documentId?: string }) {
  const [data, setData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetching the simulated data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getExtraction(documentId);
        setData(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [documentId]);

  // Handle modification of fields
  const handleEntityChange = (index: number, newValue: string) => {
    if (!data) return;
    const newEntities = [...data.entities];
    newEntities[index] = { ...newEntities[index], value: newValue };
    setData({ ...data, entities: newEntities });
  };

  const handleValidation = () => {
    if (!data) return;
    console.log("Validation soumise avec les données :", data.entities);
    alert("Extraction validée avec succès !");
  };

  if (loading) {
    return <div className="w-full text-center py-10 text-muted-foreground animate-pulse">Chargement de la révision...</div>;
  }

  if (!data) {
    return <div className="w-full text-center py-10 text-destructive">Aucune donnée trouvée.</div>;
  }

  return (
    <div className="w-full bg-card p-6 rounded-xl border shadow">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-primary">Révision :</span> {data.documentName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vue de gauche : Texte brut */}
        <div className="flex flex-col border rounded-lg h-[500px]">
          <div className="bg-muted p-3 border-b">
            <h3 className="font-semibold text-sm">Texte brut (OCR)</h3>
          </div>
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {data.rawText}
            </pre>
          </ScrollArea>
        </div>

        {/* Vue de droite : Formulaire */}
        <div className="flex flex-col h-[500px]">
          <div className="bg-muted p-3 border-b rounded-t-lg border border-b-0">
            <h3 className="font-semibold text-sm">Champs extraits</h3>
          </div>
          <ScrollArea className="flex-1 border border-t-0 p-4 rounded-b-lg">
            <div className="flex flex-col gap-4">
              {data.entities.map((entity, index) => (
                <Card key={index} className="shadow-sm border-muted transition-colors focus-within:border-primary">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <Label htmlFor={`entity-${index}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {entity.label}
                    </Label>
                    <Input 
                      id={`entity-${index}`}
                      value={entity.value}
                      onChange={(e) => handleEntityChange(index, e.target.value)}
                      className="border-muted bg-transparent focus-visible:ring-1"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleValidation} className="px-8 shadow-md">
              Valider l&apos;extraction
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
