"use client";

import React, { useState, useCallback, useRef } from "react";
import { UploadStatus } from "@/modules/ingestion/types";
import { simulateUpload } from "@/modules/ingestion/logic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function IngestionModule() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      await simulateUpload(file);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-xl border bg-card text-card-foreground shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Module d&apos;Ingestion</h2>
      
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleContainerClick}
        className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-10 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
      >
        {file ? (
          <p className="text-sm font-medium truncate">{file.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Glissez-déposez un fichier ici, ou cliquez pour sélectionner
          </p>
        )}
        <Input 
          ref={fileInputRef}
          type="file" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button 
          onClick={handleUpload} 
          disabled={!file || status === 'uploading'}
          className="w-full"
        >
          {status === 'uploading' ? 'Upload en cours...' : 'Uploader le fichier'}
        </Button>

        {status === 'success' && (
          <p className="text-sm font-medium text-primary text-center">Fichier uploadé avec succès !</p>
        )}
        {status === 'error' && (
          <p className="text-sm font-medium text-destructive text-center">Erreur lors de l&apos;upload. Réessayez.</p>
        )}
      </div>
    </div>
  );
}
