// db/index.ts (or wherever you initialize db)

import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless' 
import * as schema from './schema'

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL!
})

export const db = drizzle(pool, { schema })