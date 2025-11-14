import type { VercelRequest } from "@vercel/node";
import jwt from "jsonwebtoken";

export function getTokenFromReq(req: VercelRequest): string | null {
  // First try Authorization header
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (auth) {
    const parts = String(auth).split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
  }

  // Fallback: look for cookie named 'token' (HttpOnly cookie set by /api/login)
  const cookieHeader = req.headers["cookie"] || req.headers["Cookie"];
  if (cookieHeader) {
    const cookies = String(cookieHeader)
      .split(";")
      .map((c) => c.trim());
    for (const c of cookies) {
      const [name, ...rest] = c.split("=");
      if (name === "token") {
        return rest.join("=");
      }
    }
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
