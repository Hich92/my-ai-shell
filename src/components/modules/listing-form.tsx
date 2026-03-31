"use client";

import React, { useEffect, useState } from "react";
import { DocumentItem } from "@/modules/listing/types";
import { fetchDocuments } from "@/modules/listing/logic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ListingModule() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderStatusBadge = (status: DocumentItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="w-full bg-card p-6 border shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-6">Liste des Documents</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nom du document</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Confiance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Chargement des documents...
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Aucun document trouvé.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium truncate max-w-[300px]" title={doc.name}>
                    {doc.name}
                  </TableCell>
                  <TableCell>{renderStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-right">
                    {doc.confidence > 0 ? `${(doc.confidence * 100).toFixed(0)}%` : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
