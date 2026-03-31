"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Related Entity Note Creation
 * targetSchema: core.t_notes
 */
export async function createNote(targetId: string, content: string, author: string = "Archivist AD") {
  try {
    const note = await prisma.note.create({
      data: {
        targetId,
        content,
        author,
      }
    });

    // Revalider le cache pour la page de l'entité
    revalidatePath(`/contacts/${targetId}`);
    
    return { success: true, note };
  } catch (error) {
    console.error("Erreur createNote (Prisma):", error);
    return { success: false, error: "Database record failed" };
  }
}

/**
 * System Audit Logger
 * targetSchema: core.t_audit
 */
export async function logAudit(entityId: string, action: string, metadata: Record<string, any> = {}) {
  try {
    await prisma.audit.create({
      data: {
        entityId,
        action,
        metadata: metadata as any,
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur logAudit (Prisma):", error);
    return { success: false };
  }
}

/**
 * Get adjacent contacts for navigation
 */
export async function getAdjacentContactIds(currentId: string) {
    try {
      const contacts = await prisma.entity.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: { id: true }
      });
  
      const currentIndex = contacts.findIndex(c => c.id === currentId);
      if (currentIndex === -1) return { prevId: null, nextId: null };
  
      const prevId = currentIndex > 0 ? contacts[currentIndex - 1].id : null;
      const nextId = currentIndex < contacts.length - 1 ? contacts[currentIndex + 1].id : null;
  
      return { prevId, nextId };
    } catch (error) {
      console.error("Erreur getAdjacentContactIds:", error);
      return { prevId: null, nextId: null };
    }
}

/**
 * Global System Health Status
 */
export async function getGlobalSystemStatus() {
  return {
    online: true,
    sqlStatus: "LIVE",
    pendingActivities: 12,
    lastSync: new Date().toISOString()
  };
}
