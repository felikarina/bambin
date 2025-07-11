import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { child, childSection, pictureTag } from "../backend/db/schema";
import { and, eq } from "drizzle-orm";

function isDemoRequest(req: VercelRequest): boolean {
  const role = req.headers["x-user-role"] || req.query.role || req.body?.role;
  return role === "demo";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isDemoRequest(req)) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  if (req.method === "POST") {
    const { firstname, lastname, birthDate, userId, userId2 } = req.body;
    if (!firstname || !lastname || !birthDate || !userId) {
      res.status(400).json({ error: "Champs obligatoires manquants" });
      return;
    }
    try {
      const userId2Value = userId2 === "" ? null : userId2;

      const [newChild] = await db
        .insert(child)
        .values({
          firstname,
          lastname,
          birthDate,
          userId,
          userId2: userId2Value,
        })
        .returning();
      res.status(201).json(newChild);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'enfant:", error);
      res.status(500).json({ error: "Erreur lors de l'ajout de l'enfant" });
    }
    return;
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      res.status(400).json({ error: "ID enfant manquant" });
      return;
    }
    try {
      // Delete dependencies first
      await db
        .delete(childSection)
        .where(eq(childSection.childId, id as string));
      await db.delete(pictureTag).where(eq(pictureTag.childId, id as string));
      // Delete the child
      await db.delete(child).where(eq(child.idChild, id as string));
      res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'enfant:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'enfant" });
    }
    return;
  }

  // GET - Get all children
  try {
    const data = await db.select().from(child);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
