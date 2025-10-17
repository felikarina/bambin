import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { pictureTag } from "../backend/db/schema";
import verifyJwt from "../backend/utils/verify-jwt";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const payload = verifyJwt.requireValidToken(req as any);
  if (!payload)
    return res.status(401).json({ error: "Authentification requise" });
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
    // Insert associations between picture and children
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
    return res.status(500).json({ error: "Error while creating associations" });
  }
}
