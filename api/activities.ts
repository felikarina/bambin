import type { VercelRequest, VercelResponse } from '@vercel/node'
import { pgPool, supabase } from '../utils/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isProduction = !!process.env.VERCEL
  try {
    if (isProduction) {
      const { data, error } = await supabase.from('Activity').select('*')
      if (error) {
        res.status(500).json({ error })
        return
      }
      res.status(200).json(data)
    } else {
      const result = await pgPool.query('SELECT * FROM "Activity"')
      res.status(200).json(result.rows)
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
}
