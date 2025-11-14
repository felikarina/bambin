import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getTokenFromReq, verifyJwtToken } from "../backend/utils/verify-jwt";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const payload = verifyJwtToken(token) as any;
    return res
      .status(200)
      .json({ role: payload.role ?? null, userId: payload.id ?? null });
  } catch (e) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
