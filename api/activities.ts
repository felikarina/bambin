import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../db'
import { activity } from '../db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await db.select().from(activity)
    res.status(200).json(data)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
}
