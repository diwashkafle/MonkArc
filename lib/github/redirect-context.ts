// lib/github/redirect-context.ts

export type RedirectSource = 'new-journey' | 'edit-journey' | 'settings'

export interface GitHubRedirectContext {
  source: RedirectSource
  journeyId?: string
  timestamp: number
}

const COOKIE_NAME = 'github-redirect-source'
const COOKIE_MAX_AGE = 600 // 10 minutes

/**
 * Save redirect context before navigating to GitHub
 * Call this in onClick handlers before GitHub redirect
 */
export function saveGitHubRedirectContext(
  source: RedirectSource,
  journeyId?: string
): void {
  if (typeof window === 'undefined') return

  const context: GitHubRedirectContext = {
    source,
    journeyId,
    timestamp: Date.now(),
  }

  // Set cookie that's readable server-side
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(context)
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`

  console.log('Saved redirect context:', context)
}

/**
 * Clear redirect context cookie
 * Called after successful redirect
 */
export function clearGitHubRedirectContext(): void {
  if (typeof window === 'undefined') return

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}