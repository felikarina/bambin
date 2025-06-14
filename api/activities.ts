import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../db";
import { activity } from "../db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  try {
    const data = await db.select().from(activity);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
