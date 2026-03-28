export type DocumentStatus = "pending" | "processing" | "completed";

export interface DocumentItem {
  id: string;
  name: string;
  status: DocumentStatus;
  confidence: number;
}
