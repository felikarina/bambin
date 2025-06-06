import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'

export const pgPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5433'),
})

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
