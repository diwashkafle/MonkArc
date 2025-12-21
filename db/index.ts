import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'


console.log(process.env.DATABASE_URL!)
const sql = neon(process.env.DATABASE_URL!)

// const sql = neon(
// "postgresql://neondb_owner:npg_P80VsAdlThuU@ep-rapid-lab-a486niac-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
// )
export const db = drizzle(sql, { schema })