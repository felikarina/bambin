import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { user } from "../backend/db/schema";
import { hashPassword } from "../backend/utils/auth";
import { eq } from "drizzle-orm";

function isDemoRequest(req: VercelRequest): boolean {
  const role = req.headers["x-user-role"] || req.query.role || req.body?.role;
  return role === "demo";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isDemoRequest(req)) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }
  if (req.method === "POST") {
    const { firstname, lastname, email, role, password } = req.body;
    if (!firstname || !lastname || !email || !role || !password) {
      res.status(400).json({ error: "Champs obligatoires manquants" });
      return;
    }
    try {
      const hashedPassword = await hashPassword(password);
      const [newUser] = await db
        .insert(user)
        .values({ firstname, lastname, email, role, password: hashedPassword })
        .returning();
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
    return;
  }
  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      res.status(400).json({ error: "ID utilisateur manquant" });
      return;
    }
    try {
      await db.delete(user).where(eq(user.idUser, id as string));
      res.status(204).end();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
    return;
  }
  try {
    const data = await db.select().from(user);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
}
