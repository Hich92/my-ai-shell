export interface Entity {
  label: string;
  value: string;
}

export interface ExtractedData {
  id: string;
  documentName: string;
  entities: Entity[];
  rawText: string;
}
