import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { activity, sectionActivity } from "../backend/db/schema";
import { eq } from "drizzle-orm";
import verifyJwt from "../backend/utils/verify-jwt";
import { isDemoRequest } from "../backend/utils/auth";
import { isParentRequest } from "../backend/utils/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // require a valid token for mutating requests
  if (
    req.method === "POST" ||
    req.method === "DELETE" ||
    req.method === "PUT"
  ) {
    const payload = verifyJwt.requireValidToken(req);
    if (!payload) {
      res.status(401).json({ error: "Authentification requise" });
      return;
    }
  }

  if (
    req.method === "DELETE" ||
    req.method === "PUT" ||
    (req.method === "POST" && isDemoRequest(req))
  ) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  if (
    (req.method === "DELETE" ||
      req.method === "PUT" ||
      req.method === "POST") &&
    isParentRequest(req)
  ) {
    res.status(403).json({ error: "Accès interdit en mode parent" });
    return;
  }

  if (req.method === "POST") {
    try {
      const { date, title, description, category, userId, section } = req.body;
      if (!date || !title || !description || !category || !userId) {
        return res.status(400).json({ error: "Champs manquants" });
      }
      const [newActivity] = await db
        .insert(activity)
        .values({ date, title, description, category, userId })
        .returning();
      if (section) {
        await db.insert(sectionActivity).values({
          activityId: newActivity.idActivity,
          sectionId: section,
        });
      }
      return res.status(201).json({ ...newActivity, section });
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
      await db
        .delete(sectionActivity)
        .where(eq(sectionActivity.activityId, id as string));
      await db.delete(activity).where(eq(activity.idActivity, id as string));
      return res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'activité" });
    }
  }
  if (req.method === "PUT") {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "ID activité manquant" });
    }
    try {
      const { date, title, description, category, userId, section } = req.body;
      const updateFields: any = {};
      if (date !== undefined) updateFields.date = date;
      if (title !== undefined) updateFields.title = title;
      if (description !== undefined) updateFields.description = description;
      if (category !== undefined) updateFields.category = category;
      if (userId !== undefined) updateFields.userId = userId;
      const [updatedActivity] = await db
        .update(activity)
        .set(updateFields)
        .where(eq(activity.idActivity, id as string))
        .returning();
      if (section !== undefined) {
        await db
          .delete(sectionActivity)
          .where(eq(sectionActivity.activityId, id as string));
        if (section) {
          await db.insert(sectionActivity).values({
            activityId: id as string,
            sectionId: section,
          });
        }
      }
      return res.status(200).json({ ...updatedActivity, section });
    } catch (error) {
      console.error("Erreur lors de la modification de l'activité:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la modification de l'activité" });
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
