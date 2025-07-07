import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { section } from "../backend/db/schema";

function isDemoRequest(req: VercelRequest): boolean {
  const role = req.headers["x-user-role"] || req.query.role || req.body?.role;
  return role === "demo";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isDemoRequest(req)) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  // GET - Get all sections
  try {
    const data = await db.select().from(section);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
