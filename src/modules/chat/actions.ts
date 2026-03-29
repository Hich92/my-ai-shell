"use server";

import { callMoondustApi } from "./moondust";

export type MessageDto = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

export async function getChatHistory(): Promise<MessageDto[]> {
  // Neutralisation temporaire pour le focus SQL pur du Pense-bête
  console.log("[INFO] Récupération de l'historique du chat simulée (Bascule SQL en cours)");
  return [];
}

export async function sendMessage(content: string): Promise<MessageDto[]> {
  const userMsg: MessageDto = {
    id: "user-" + Date.now().toString(),
    role: "user",
    content: content,
    createdAt: new Date(),
  };

  // On by-passe la persistance base de données (AuditLog/Conversation) temporairement
  console.log("[USER_ACTION] Message utilisateur reçu (Database Bypass activé)");

  const aiResponseText = await callMoondustApi(content);

  const aiMsg: MessageDto = {
    id: "ai-memory-" + Date.now().toString(),
    role: "assistant",
    content: aiResponseText,
    createdAt: new Date(),
  };

  return [userMsg, aiMsg];
}
