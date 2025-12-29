import { db } from '@/db'
import { accounts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// CHECK IF USER HAS GITHUB CONNECTED

export async function hasGitHubConnected(userId: string): Promise<boolean> {
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'github')
    )
  })
  
  return !!githubAccount
}

// GET USER'S GITHUB ACCESS TOKEN

export async function getGitHubAccessToken(userId: string): Promise<string | null> {
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'github')
    )
  })
  
  return githubAccount?.access_token || null
}

export async function getLinkedProviders(userId: string): Promise<string[]> {
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
    columns: {
      provider: true
    }
  })

  return userAccounts.map(account => account.provider)
}

export async function shouldShowGitHubWarning(userId: string): Promise<boolean> {
  const providers = await getLinkedProviders(userId)
  
  // Only show if user has Google but not GitHub
  const hasGoogle = providers.includes('google')
  const hasGitHub = providers.includes('github')
  
  return hasGoogle && !hasGitHub
}