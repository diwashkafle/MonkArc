import { db } from '@/db'
import { accounts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// ========================================
// CHECK IF USER HAS GITHUB CONNECTED
// ========================================

export async function hasGitHubConnected(userId: string): Promise<boolean> {
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'github')
    )
  })
  
  return !!githubAccount
}

// ========================================
// GET USER'S GITHUB ACCESS TOKEN
// ========================================

export async function getGitHubAccessToken(userId: string): Promise<string | null> {
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'github')
    )
  })
  
  return githubAccount?.access_token || null
}