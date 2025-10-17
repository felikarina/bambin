import type { VercelRequest } from "@vercel/node";
import jwt from "jsonwebtoken";

export function getTokenFromReq(req: VercelRequest): string | null {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth) return null;
  const parts = String(auth).split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return null;
}

export function verifyJwtToken(token: string) {
  // will throw if invalid
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export function requireValidToken(req: VercelRequest) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  try {
    const payload = verifyJwtToken(token) as any;
    return payload;
  } catch (e) {
    return null;
  }
}

export default { getTokenFromReq, verifyJwtToken, requireValidToken };
