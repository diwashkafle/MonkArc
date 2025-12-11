import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { users, accounts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { GitHubConnectionSettings } from '@/components/ProtectedUiComponents/settings/github-connection-settings'
import { DeleteAccountButton } from '@/components/ProtectedUiComponents/settings/delete-account-button'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  // Check GitHub connection
  const githubAccount = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session.user.id),
      eq(accounts.provider, 'github')
    )
  })
  
  const isGitHubConnected = !!githubAccount
  
  // Server action for updating username
  async function updateUsername(formData: FormData) {
    'use server'
    
    const session = await auth()
    if (!session) throw new Error('Unauthorized')
    
    const newUsername = formData.get('username') as string
    
    // Validate format
    if (!/^[a-z0-9_-]{3,30}$/.test(newUsername)) {
      throw new Error('Invalid username format')
    }
    
    // Check if taken
    const existing = await db.query.users.findFirst({
      where: eq(users.username, newUsername)
    })
    
    if (existing && existing.id !== session.user.id) {
      throw new Error('Username already taken')
    }
    
    // Update
    await db.update(users)
      .set({ username: newUsername })
      .where(eq(users.id, session.user.id))
    
    revalidatePath('/settings')
    revalidatePath(`/profile/${newUsername}`)
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">
            Manage your account preferences and integrations
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Profile Information
            </h2>
            
            {/* Account Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="text-sm font-medium text-slate-900">Name</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {session.user.name}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Managed by Google
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="text-sm font-medium text-slate-900">Email</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {session.user.email}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Managed by Google
                </div>
              </div>
            </div>
            
            {/* Username Form */}
            <form action={updateUsername} className="pt-4 border-t">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue={session.user.username || ''}
                pattern="^[a-z0-9_-]{3,30}$"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="johndoe"
              />
              <p className="mt-2 text-xs text-slate-500">
                3-30 characters, lowercase letters, numbers, hyphens, and underscores only
              </p>
              
              {/* Profile URL Preview */}
              {session.user.username && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600 mb-1">Your profile URL:</p>
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    monkarc.com/profile/{session.user.username}
                  </Link>
                </div>
              )}
              
              <button
                type="submit"
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Save Username
              </button>
            </form>
          </div>
          
          {/* GitHub Integration Section */}
          <GitHubConnectionSettings
            isConnected={isGitHubConnected}
            githubUsername={githubAccount?.providerAccountId || null}
            githubEmail={session.user.email}
          />
          
          {/* Preferences Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Preferences
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Email notifications
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Receive emails about your journey progress and milestones
                  </div>
                </div>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Public profile
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Allow others to view your profile and public journeys
                  </div>
                </div>
              </label>
            </div>
            
            <p className="mt-4 text-xs text-slate-500">
              💡 More preference options coming soon!
            </p>
          </div>
          
          {/* Connected Accounts */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Connected Accounts
            </h2>
            
            <div className="space-y-3">
              {/* Google Account */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2 border border-slate-200">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Google</div>
                    <div className="text-xs text-slate-500">{session.user.email}</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Connected
                </div>
              </div>
              
              {/* GitHub Account Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-900 p-2">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">GitHub</div>
                    <div className="text-xs text-slate-500">
                      {isGitHubConnected ? githubAccount?.providerAccountId : 'Not connected'}
                    </div>
                  </div>
                </div>
                {isGitHubConnected ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Connected
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                    Not connected
                  </div>
                )}
              </div>
            </div>
            
            <p className="mt-4 text-xs text-slate-500">
              See GitHub Integration section below for detailed connection settings
            </p>
          </div>
          
          {/* Danger Zone */}
         <DeleteAccountButton />
        </div>
      </main>
    </div>
  )
}
