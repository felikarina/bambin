import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../backend/db";
import { user } from "../backend/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function isDemoRequest(req: VercelRequest): boolean {
  const role = req.headers["x-user-role"] || req.query.role || req.body?.role;
  return role === "demo";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  if (isDemoRequest(req)) {
    res.status(403).json({ error: "Accès interdit en mode démo" });
    return;
  }

  const { email, password } = req.body;

  try {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!foundUser) {
      return res.status(401).json({
        error:
          "Mail non reconnu, merci de vérifier l'orthographe ou contactez l'administrateur",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: foundUser.idUser, role: foundUser.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .json({ token, role: foundUser.role, userId: foundUser.idUser });
  } catch (error) {
    console.error("Erreur lors de la tentative de connexion:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
