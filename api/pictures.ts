import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { picture } from "../backend/db/schema";
import { eq } from "drizzle-orm";
import { pictureTag, child } from "../backend/db/schema";
import verifyJwt from "../backend/utils/verify-jwt";
import { isDemoRequest } from "../backend/utils/auth";
import { isParentRequest } from "../backend/utils/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = verifyJwt.requireValidToken(req);
  if (!payload) {
    res.status(401).json({ error: "Authentification requise" });
    return;
  }

  if (
    (req.method === "POST" || req.method === "DELETE") &&
    isDemoRequest(req)
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

  // Endpoint to link children to a picture
  if (req.method === "POST" && req.url?.endsWith("/tags")) {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: "Invalid JSON body" });
        }
      }
      const { idPicture, childIds } = body;
      if (!idPicture || !Array.isArray(childIds)) {
        return res.status(400).json({ error: "Missing or invalid fields" });
      }
      // Insert associations
      const values = childIds.map((childId: string) => ({
        pictureId: idPicture,
        childId,
      }));
      await db.insert(pictureTag).values(values);
      return res
        .status(201)
        .json({ message: "Associations created", count: values.length });
    } catch (error) {
      console.error("Error while creating picture_tag associations:", error);
      return res
        .status(500)
        .json({ error: "Error while creating associations" });
    }
  }
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: "Body JSON invalide" });
        }
      }
      const { date, title, media, userId } = body;
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
    // Get all pictures
    const picturesData = await db.select().from(picture);
    // Get all picture_tag associations
    const tags = await db.select().from(pictureTag);
    // Get all children (for names)
    const childrenData = await db.select().from(child);
    // Build a map of childId -> child
    const childMap = Object.fromEntries(
      childrenData.map((c) => [c.idChild, c])
    );
    // For each picture, add an 'children' field with associated children (firstname, lastname)
    const result = picturesData.map((pic) => {
      const associated = tags.filter((t) => t.pictureId === pic.idPicture);
      const children = associated
        .map((t) => {
          const c = childMap[t.childId];
          return c
            ? {
                idChild: c.idChild,
                firstname: c.firstname,
                lastname: c.lastname,
              }
            : null;
        })
        .filter(Boolean);
      return { ...pic, children };
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
}
