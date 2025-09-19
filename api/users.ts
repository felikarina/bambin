import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { user } from "../backend/db/schema";
import { hashPassword, generateStrongPassword } from "../backend/utils/auth";
import { and, eq, or } from "drizzle-orm";
import {
  child,
  activity,
  picture,
  message,
  childSection,
  pictureTag,
} from "../backend/db/schema";

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
    const { firstname, lastname, email, role } = req.body;
    if (!firstname || !lastname || !email || !role) {
      res.status(400).json({ error: "Champs obligatoires manquants" });
      return;
    }
    try {
      const initialPassword = generateStrongPassword(12);
      const hashedPassword = await hashPassword(initialPassword);
      const [newUser] = await db
        .insert(user)
        .values({ firstname, lastname, email, role, password: hashedPassword })
        .returning();
      const { password: _removed, ...userWithoutPassword } = newUser as any;
      res.status(201).json({ user: userWithoutPassword, initialPassword });
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
      // Delete the user - foreign key constraints with ON DELETE SET NULL
      // will automatically set user references to null in related tables
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
  if (req.method === "PUT") {
    const id = req.query.id as string | undefined;
    const action = (req.body && (req.body.action as string)) || "";
    if (!id) {
      res.status(400).json({ error: "ID utilisateur manquant" });
      return;
    }
    if (action !== "resetPassword") {
      res.status(400).json({ error: "Action non prise en charge" });
      return;
    }
    try {
      const newPassword = generateStrongPassword(12);
      const hashed = await hashPassword(newPassword);
      const [updated] = await db
        .update(user)
        .set({ password: hashed })
        .where(eq(user.idUser, id))
        .returning();
      if (!updated) {
        res.status(404).json({ error: "Utilisateur introuvable" });
        return;
      }
      res.status(200).json({ initialPassword: newPassword });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      res
        .status(500)
        .json({ error: "Erreur lors de la réinitialisation du mot de passe" });
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
