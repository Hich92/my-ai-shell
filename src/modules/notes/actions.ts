"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getNotes() {
  try {
    // Attention aux guillemets doubles : Prisma génère les tables avec la casse stricte.
    const res = await pool.query('SELECT * FROM "Note" ORDER BY "createdAt" DESC');
    return res.rows;
  } catch (error) {
    console.error("Erreur récupération des notes (pg):", error);
    return [];
  }
}

export async function addNote(content: string) {
  try {
    if (!content.trim()) return;
    
    // Le cuid de Prisma étant désactivé, nous générons un UUID natif à la volée
    const id = crypto.randomUUID();
    
    await pool.query(
      'INSERT INTO "Note" (id, content) VALUES ($1, $2)',
      [id, content]
    );
    
    revalidatePath("/notes");
  } catch (error) {
    console.error("Erreur création note (pg):", error);
    throw new Error("Impossible d'enregistrer le pense-bête via SQL pur.");
  }
}
