import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { user } from "../backend/db/schema";
import { hashPassword } from "../backend/utils/auth";
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
      // 1. Delete messages sent by this user
      await db.delete(message).where(eq(message.senderId, id as string));
      // 2. Delete activities created by this user
      await db.delete(activity).where(eq(activity.userId, id as string));
      // 3. Delete pictures created by this user
      await db.delete(picture).where(eq(picture.userId, id as string));
      // 4. Find all children where user is parent
      const childrenToDelete = await db
        .select()
        .from(child)
        .where(
          or(eq(child.userId, id as string), eq(child.userId2, id as string))
        );
      // 5. For each child, delete dependencies then the child
      for (const c of childrenToDelete) {
        await db
          .delete(childSection)
          .where(eq(childSection.childId, c.idChild));
        await db.delete(pictureTag).where(eq(pictureTag.childId, c.idChild));
        await db.delete(child).where(eq(child.idChild, c.idChild));
      }
      // 6. Delete the user
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
