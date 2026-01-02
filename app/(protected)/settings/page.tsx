// app/settings/page.tsx

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { accounts, githubInstallations } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { AccountInfo } from '@/components/ProtectedUiComponents/settings/account-info'
import { ProfileSection } from '@/components/ProtectedUiComponents/settings/profile-section'
import { GitHubAppSettings } from '@/components/ProtectedUiComponents/journeys/github/github-app-setting'
import { PreferencesSection } from '@/components/ProtectedUiComponents/settings/preferences-section'
import { ConnectedAccounts } from '@/components/ProtectedUiComponents/settings/connected-accounts'
import { DeleteAccountButton } from '@/components/ProtectedUiComponents/settings/delete-account-button'
import { ToastHandler } from '@/components/toast/toast-handler'
import { getInstallationOctokit } from '@/lib/github-app/client'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  
  // Check old GitHub OAuth connection (legacy)
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session.user.id),
      eq(accounts.provider, 'github')
    )
  })
  
  const isGitHubConnected = !!githubAccount
  
  // ✅ Check GitHub App installation
  const installation = await db.query.githubInstallations.findFirst({
    where: eq(githubInstallations.userId, session.user.id),
  })
  
  // ✅ Fetch repo count if installed
  let repoCount = 0
  if (installation) {
    try {
      const octokit = await getInstallationOctokit(installation.installationId)
      const { data } = await octokit.request('GET /installation/repositories', {
        per_page: 1, // Just get count, not all repos
      })
      repoCount = data.total_count
    } catch (error) {
      console.error('Failed to fetch repo count:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">
            Manage your account preferences and integrations
          </p>
        </div>
        
        <ToastHandler />
        
        <div className="space-y-6">
          {/* Account Info (Server - Read Only) */}
          <AccountInfo 
            name={session.user.name}
            email={session.user.email}
          />
          
          {/* Profile Section (Client - Username Form) */}
          <ProfileSection 
            currentUsername={session.user.username || ''}
            userId={session.user.id}
          />
          
          {/* ✅ GitHub App Integration (New) */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              GitHub Integration
            </h2>
            <GitHubAppSettings 
              isInstalled={!!installation}
              installationId={installation?.installationId}
              repoCount={repoCount}
            />
          </div>
          
          {/* Preferences (Client - Toggles) */}
          <PreferencesSection userId={session.user.id} />
          
          {/* Connected Accounts (Server - Display) */}
          <ConnectedAccounts
            email={session.user.email}
            isGitHubConnected={isGitHubConnected}
            githubUsername={githubAccount?.providerAccountId || null}
          />
          
          {/* Danger Zone */}
          <DeleteAccountButton />
        </div>
      </main>
    </div>
  )
}