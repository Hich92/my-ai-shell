import { DocumentItem } from "./types";

export const fetchDocuments = async (): Promise<DocumentItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Contrat_cadre_2024.pdf",
          status: "pending",
          confidence: 0,
        },
        {
          id: "2",
          name: "Facture_Mars_2024.pdf",
          status: "processing",
          confidence: 0.45,
        },
        {
          id: "3",
          name: "Bilan_Annuel.xlsx",
          status: "completed",
          confidence: 0.98,
        },
      ]);
    }, 1000); // 1 seconde de simulation
  });
};
