import type { VercelRequest, VercelResponse } from '@vercel/node'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { activity } from '../db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Avec Drizzle, plus besoin de distinguer production/local !
    const data = await db.select().from(activity)
    res.status(200).json(data)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
}

// Exemple avec des requêtes plus complexes
export async function getActivityById(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  try {
    const allActivity = await db
      .select()
      .from(activity)
      .where(eq(activity.idActivity, String(id)))
      .limit(1)

    if (allActivity.length === 0) {
      return res.status(404).json({ error: 'Activity not found' })
    }

    res.status(200).json(allActivity[0])
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database query failed' })
  }
}
