"use server";

import { pool } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/modules/core/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EntityContact = {
  id: string; 
  name: string;
  is_company: boolean;
  email: string | null;
  phone: string | null;
  parent_id: string | null; 
  created_at: Date;
  is_active: boolean;
  parent_name?: string | null;
};

export type CompanyOption = {
  id: string; 
  name: string;
};

// ==========================================
// 1. LECTURE & PAGINATION & RECHERCHE
// ==========================================

export async function getContacts(page: number = 1, limit: number = 10, isActive: boolean = true, searchQuery: string = "") {
  const offset = (page - 1) * limit;

  try {
    const searchFilter = searchQuery.trim() !== "" ? `%${searchQuery.trim()}%` : null;

    let countQuery = `SELECT COUNT(*) FROM sys_org.m_entities e WHERE e.is_active = $1`;
    let dataQuery = `
      SELECT e.id, e.name, e.is_company, e.email, e.phone, e.parent_id, e.created_at, e.is_active, p.name as parent_name
      FROM sys_org.m_entities e
      LEFT JOIN sys_org.m_entities p ON e.parent_id = p.id
      WHERE e.is_active = $1
    `;
    const paramsCount: unknown[] = [isActive];
    const paramsData: unknown[] = [isActive];

    if (searchFilter) {
      countQuery += ` AND e.name ILIKE $2`;
      dataQuery += ` AND e.name ILIKE $2`;
      paramsCount.push(searchFilter);
      paramsData.push(searchFilter);
    }
    
    dataQuery += ` ORDER BY e.name ASC LIMIT $${paramsData.length + 1} OFFSET $${paramsData.length + 2}`;
    paramsData.push(limit, offset);

    const [countRes, dataRes] = await Promise.all([
      pool.query(countQuery, paramsCount),
      pool.query(dataQuery, paramsData)
    ]);

    const totalItems = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: dataRes.rows as EntityContact[],
      totalPages,
      currentPage: page,
      totalItems
    };
  } catch (error) {
    console.error(`Erreur récupération Contacts :`, error);
    return { data: [], totalPages: 0, currentPage: 1, totalItems: 0 };
  }
}

export async function getCompanies(): Promise<CompanyOption[]> {
  try {
    const res = await pool.query(`SELECT id, name FROM sys_org.m_entities WHERE is_company = true AND is_active = true ORDER BY name ASC`);
    return res.rows as CompanyOption[];
  } catch {
    return [];
  }
}

export async function getContactById(id: string): Promise<EntityContact | null> {
  try {
    const contact = await prisma.entity.findUnique({
      where: { id },
    });
    
    if (!contact) return null;

    return {
      id: contact.id,
      name: contact.name,
      is_company: contact.isCompany,
      email: contact.email,
      phone: contact.phone,
      parent_id: contact.parentId,
      created_at: contact.createdAt,
      is_active: contact.isActive,
    } as EntityContact;
  } catch (error) {
    console.error("Erreur getContactById (Prisma):", error);
    return null;
  }
}

/**
 * Fetch Entity with its related Notes (Chatter)
 * cross-schema: sys_org.m_entities <-> core.t_notes
 */
export async function getContactWithNotes(id: string) {
  try {
    const contact = await prisma.entity.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return contact;
  } catch (error) {
    console.error("Erreur getContactWithNotes:", error);
    return null;
  }
}

// ==========================================
// 2. ÉCRITURE MÉTIER
// ==========================================

export async function createContact(formData: FormData) {
  const name = formData.get("name") as string;
  const is_company = formData.get("is_company") === "on";
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const parent_id_raw = formData.get("parent_id") as string | null;
  const parent_id = (parent_id_raw === "" || !parent_id_raw) ? null : parent_id_raw;

  if (!name || name.trim() === "") throw new Error("Nom obligatoire.");

  try {
    const entity = await prisma.entity.create({
      data: {
        name: name.trim(),
        isCompany: is_company,
        email: email || null,
        phone: phone || null,
        parentId: parent_id,
      }
    });

    await logAudit(entity.id, "INSERT", { name: entity.name, is_company, parent_id });

    revalidatePath("/contacts");
    redirect("/contacts");
  } catch (error) {
    console.error("Erreur Create (Prisma):", error);
    throw new Error("Impossible de créer l'entité.");
  }
}

export async function updateContact(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const is_company = formData.get("is_company") === "on";
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const parent_id_raw = formData.get("parent_id") as string | null;
  const parent_id = (parent_id_raw === "" || !parent_id_raw) ? null : parent_id_raw;

  if (!name || name.trim() === "") throw new Error("Nom obligatoire.");

  try {
    const updated = await prisma.entity.update({
      where: { id },
      data: {
        name: name.trim(),
        isCompany: is_company,
        email: email || null,
        phone: phone || null,
        parentId: parent_id,
      }
    });

    await logAudit(id, "UPDATE", { name: updated.name, parent_id });

    revalidatePath("/contacts");
    redirect("/contacts");
  } catch (error) {
    console.error("Erreur Update (Prisma):", error);
    throw new Error("Impossible de mettre à jour l'entité.");
  }
}

// ==========================================
// 3. ARCHIVAGE & RESTAURATION
// ==========================================

async function toggleArchiveStatus(id: string, targetStatus: boolean, actionType: string) {
  try {
    await prisma.entity.update({
      where: { id },
      data: { isActive: targetStatus }
    });

    await logAudit(id, actionType, { target_active_status: targetStatus });
  } catch (error) {
    console.error("Erreur toggleArchiveStatus (Prisma):", error);
    throw new Error(`Suspension système : impossible d'appliquer le statut.`);
  }
  
  revalidatePath("/contacts");
}

export async function archiveContact(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await toggleArchiveStatus(id, false, "ARCHIVE");
}

export async function restoreContact(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await toggleArchiveStatus(id, true, "RESTORE");
}

// ==========================================
// 4. MISE À JOUR SANS REDIRECTION (pour le client component)
// ==========================================

export type UpdateResult = {
  success: boolean;
  error?: string;
  updatedFields?: { name: string };
};

/**
 * Identique à updateContact mais SANS redirect.
 */
export async function updateContactInPlace(
  id: string,
  formData: FormData
): Promise<UpdateResult> {
  const name = formData.get("name") as string;
  const is_company = formData.get("is_company") === "on";
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const parent_id_raw = formData.get("parent_id") as string | null;
  const parent_id = !parent_id_raw ? null : parent_id_raw;

  if (!name || !name.trim()) {
    return { success: false, error: "Le nom de l'entité est obligatoire." };
  }

  try {
    const updated = await prisma.entity.update({
      where: { id },
      data: {
        name: name.trim(),
        isCompany: is_company,
        email: email || null,
        phone: phone || null,
        parentId: parent_id,
      }
    });

    // Relational Bridge: Log to core.t_audit (Odoo-style)
    await logAudit(id, "UPDATE", { 
        name: updated.name,
        system_action: "IN_PLACE_UPDATE"
    });

    revalidatePath(`/contacts/${id}`);
    revalidatePath("/contacts");

    return { success: true, updatedFields: { name: updated.name } };
  } catch (error) {
    console.error("[contacts/actions] updateContactInPlace (Prisma) error:", error);
    return { success: false, error: "Relational update failed." };
  }
}