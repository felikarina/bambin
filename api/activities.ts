import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./db";
import { activity } from "./db/schema";
import { eq } from "drizzle-orm";

function isDemoRequest(req: VercelRequest): boolean {
  const role = req.headers["x-user-role"] || req.query.role || req.body?.role;
  return role === "demo";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (
    (req.method === "POST" || req.method === "DELETE") &&
    isDemoRequest(req)
  ) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  if (req.method === "POST") {
    try {
      const { date, title, description, category, userId } = req.body;
      if (!date || !title || !description || !category || !userId) {
        return res.status(400).json({ error: "Champs manquants" });
      }
      const [newActivity] = await db
        .insert(activity)
        .values({ date, title, description, category, userId })
        .returning();
      return res.status(201).json(newActivity);
    } catch (error) {
      console.error("Erreur lors de la création de l'activité:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la création de l'activité" });
    }
  }
  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "ID utilisateur manquant" });
    }
    try {
      await db.delete(activity).where(eq(activity.idActivity, id as string));
      return res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'activité" });
    }
  }
  try {
    const data = await db.select().from(activity);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
}
