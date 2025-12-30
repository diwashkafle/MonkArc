'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
}

export async function ensureUsername(userId: string, name: string, email: string) {
  // 1. Check if already has username (1 query)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { username: true }
  })
  
  if (user?.username) return user.username
  
  // 2. Generate base username
  const baseUsername = slugify(email.split('@')[0] || 'user')
  
  // 3. Find available username (1 query with regex)
  const existingUsernames = await db
    .select({ username: users.username })
    .from(users)
    .where(sql`${users.username} ~ ${`^${baseUsername}[0-9]*$`}`)
  
  let username = baseUsername
  if (existingUsernames.length > 0) {
    // Find highest suffix
    const suffixes = existingUsernames
      .map(u => parseInt(u.username?.replace(baseUsername, '') || '0'))
      .filter(n => !isNaN(n))
    
    const maxSuffix = Math.max(0, ...suffixes)
    username = `${baseUsername}${maxSuffix + 1}`
  }
  
  // 4. Update user (1 query)
  await db.update(users)
    .set({ username })
    .where(eq(users.id, userId))
  
  return username
}