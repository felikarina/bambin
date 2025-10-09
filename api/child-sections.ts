import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { childSection } from "../backend/db/schema";
import { eq } from "drizzle-orm";
import verifyJwt from "../backend/utils/verify-jwt";
import { isDemoRequest } from "../backend/utils/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  if (isDemoRequest(req)) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  if (req.method === "POST") {
    const { childId, sectionName } = req.body;
    if (!childId || !sectionName) {
      res.status(400).json({ error: "Champs obligatoires manquants" });
      return;
    }
    try {
      // Check if association already exists
      const existingAssociation = await db
        .select()
        .from(childSection)
        .where(eq(childSection.childId, childId));

      if (existingAssociation.length > 0) {
        // Update existing association
        await db
          .update(childSection)
          .set({ sectionId: sectionName })
          .where(eq(childSection.childId, childId));
      } else {
        // Create new association
        await db.insert(childSection).values({
          childId,
          sectionId: sectionName,
        });
      }
      res.status(201).json({
        message: "Association enfant-section créée",
        childId,
        sectionName,
      });
    } catch (error) {
      console.error("Erreur lors de l'association enfant-section:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'association enfant-section" });
    }
    return;
  }

  if (req.method === "DELETE") {
    const childId = req.query.childId;
    if (!childId) {
      res.status(400).json({ error: "ID enfant manquant" });
      return;
    }
    try {
      await db
        .delete(childSection)
        .where(eq(childSection.childId, childId as string));
      res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'association:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'association" });
    }
    return;
  }

  // GET - Get all child-section associations
  try {
    const data = await db
      .select({
        idChildSection: childSection.idChildSection,
        childId: childSection.childId,
        sectionId: childSection.sectionId,
      })
      .from(childSection);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
