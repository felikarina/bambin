import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { sectionActivity } from "../backend/db/schema";
import verifyJwt from "../backend/utils/verify-jwt";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = verifyJwt.requireValidToken(req);
  if (!payload) {
    res.status(401).json({ error: "Authentification requise" });
    return;
  }
  // GET - Get all section-activity associations
  try {
    const data = await db.select().from(sectionActivity);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
