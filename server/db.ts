import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============ INITIATIVES & SUB-BOXES ============

import { initiatives, subBoxes, InsertInitiative, InsertSubBox, Initiative, SubBox } from "../drizzle/schema";

export async function getInitiativesByGoal(goal: "A" | "B" | "C" | "D") {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(initiatives).where(eq(initiatives.goal, goal));
  } catch (error) {
    console.error("[Database] Failed to get initiatives by goal:", error);
    return [];
  }
}

export async function getAllInitiatives() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(initiatives);
  } catch (error) {
    console.error("[Database] Failed to get all initiatives:", error);
    return [];
  }
}

export async function createInitiative(data: InsertInitiative) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(initiatives).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create initiative:", error);
    throw error;
  }
}

export async function updateInitiative(id: number, data: Partial<Initiative>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    return await db.update(initiatives).set(data).where(eq(initiatives.id, id));
  } catch (error) {
    console.error("[Database] Failed to update initiative:", error);
    throw error;
  }
}

export async function deleteInitiative(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    return await db.delete(initiatives).where(eq(initiatives.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete initiative:", error);
    throw error;
  }
}

export async function getSubBoxesByInitiative(initiativeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(subBoxes).where(eq(subBoxes.initiativeId, initiativeId));
  } catch (error) {
    console.error("[Database] Failed to get sub-boxes:", error);
    return [];
  }
}

export async function createSubBox(data: InsertSubBox) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    return await db.insert(subBoxes).values(data);
  } catch (error) {
    console.error("[Database] Failed to create sub-box:", error);
    throw error;
  }
}

export async function updateSubBox(id: number, data: Partial<SubBox>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    return await db.update(subBoxes).set(data).where(eq(subBoxes.id, id));
  } catch (error) {
    console.error("[Database] Failed to update sub-box:", error);
    throw error;
  }
}

export async function deleteSubBox(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    return await db.delete(subBoxes).where(eq(subBoxes.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete sub-box:", error);
    throw error;
  }
}
