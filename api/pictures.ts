import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../db";
import { picture } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const { date, title, media, userId } = req.body;
      if (!date || !title || !media || !userId) {
        return res.status(400).json({ error: "Champs manquants" });
      }
      const [newPicture] = await db
        .insert(picture)
        .values({ date, title, media, userId })
        .returning();
      return res.status(201).json(newPicture);
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
      return res.status(400).json({ error: "ID photo manquant" });
    }
    try {
      await db.delete(picture).where(eq(picture.idPicture, id as string));
      return res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la photo" });
    }
  }
  try {
    const data = await db.select().from(picture);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
}
