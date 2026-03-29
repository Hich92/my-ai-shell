"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EntityContact = {
  id: string; // CHANGÉ : UUID = string
  name: string;
  is_company: boolean;
  email: string | null;
  phone: string | null;
  parent_id: string | null; // CHANGÉ : UUID = string
  created_at: Date;
  is_active: boolean;
  parent_name?: string | null;
};

export type CompanyOption = {
  id: string; // CHANGÉ : UUID = string
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
    const paramsCount: any[] = [isActive];
    const paramsData: any[] = [isActive];

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
  } catch (error) {
    return [];
  }
}

export async function getContactById(id: string): Promise<EntityContact | null> {
  try {
    const res = await pool.query(`SELECT * FROM sys_org.m_entities WHERE id = $1`, [id]);
    if (res.rowCount === 0) return null;
    return res.rows[0] as EntityContact;
  } catch (error) {
    console.error("Erreur getContactById:", error);
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
  
  // SÉCURITÉ UUID : Si vide, on envoie null, pas une string vide
  const parent_id = (parent_id_raw === "" || !parent_id_raw) ? null : parent_id_raw;

  if (!name || name.trim() === "") throw new Error("Nom obligatoire.");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO sys_org.m_entities (name, is_company, email, phone, parent_id) VALUES ($1, $2, $3, $4, $5)`,
      [name.trim(), is_company, email || null, phone || null, parent_id]
    );
    await client.query(
      `INSERT INTO core.t_audit (module_name, action_type, severity, details) VALUES ($1, $2, $3, $4)`,
      ['ORG', 'INSERT', 'INFO', JSON.stringify({ name: name.trim(), is_company, parent_id })]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur Create:", error);
    throw new Error("Impossible de créer l'entité.");
  } finally {
    client.release();
  }

  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function updateContact(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const is_company = formData.get("is_company") === "on";
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const parent_id_raw = formData.get("parent_id") as string | null;
  
  // SÉCURITÉ UUID : On ne parseInt pas un UUID !
  const parent_id = (parent_id_raw === "" || !parent_id_raw) ? null : parent_id_raw;

  if (!name || name.trim() === "") throw new Error("Nom obligatoire.");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE sys_org.m_entities SET name = $1, is_company = $2, email = $3, phone = $4, parent_id = $5, updated_at = NOW() WHERE id = $6`,
      [name.trim(), is_company, email || null, phone || null, parent_id, id]
    );
    await client.query(
      `INSERT INTO core.t_audit (module_name, action_type, severity, details) VALUES ($1, $2, $3, $4)`,
      ['ORG', 'UPDATE', 'INFO', JSON.stringify({ id, name: name.trim(), parent_id })]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur Update SQL détaillée:", error);
    throw new Error("Impossible de mettre à jour l'entité.");
  } finally {
    client.release();
  }

  revalidatePath("/contacts");
  redirect("/contacts");
}

// ==========================================
// 3. ARCHIVAGE & RESTAURATION
// ==========================================
async function toggleArchiveStatus(id: string, targetStatus: boolean, actionType: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`UPDATE sys_org.m_entities SET is_active = $1 WHERE id = $2`, [targetStatus, id]);
    await client.query(
      `INSERT INTO core.t_audit (module_name, action_type, severity, details) VALUES ($1, $2, $3, $4)`,
      ['ORG', actionType, 'INFO', JSON.stringify({ id, target_active_status: targetStatus })]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`Suspension système : impossible d'appliquer le statut.`);
  } finally {
    client.release();
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