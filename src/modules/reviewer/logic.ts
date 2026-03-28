import { ExtractedData } from "./types";

export const getExtraction = async (id: string): Promise<ExtractedData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        documentName: "Facture_Mars_2024.pdf",
        entities: [
          { label: "Nom complet", value: "Jean Dupont" },
          { label: "Date de facturation", value: "05/03/2024" },
          { label: "Montant Total", value: "1 250,50 €" },
        ],
        rawText: `FACTURE N° 2024-001\n\nDate: 05/03/2024\n\nClient:\nJean Dupont\n123 Rue de la République\n75001 Paris\n\nDésignation\nPrestation de service - Développement Web\n\nTotal HT : 1000,00 Euro\nTVA 20% : 200,00 Euro\n\nTotal TTC : 1250,50 €\n\nMerci de votre confiance.`,
      });
    }, 800); // Simulation d'une latence réseau
  });
};
