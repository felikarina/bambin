import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { section } from "../backend/db/schema";
import verifyJwt from "../backend/utils/verify-jwt";

function isDemoRequest(req: VercelRequest): boolean {
  const payload = verifyJwt.requireValidToken(req);
  if (!payload) return false;
  try {
    return (payload as any).role === "demo";
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET - Get all sections
  try {
    const data = await db.select().from(section);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
