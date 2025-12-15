import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasGitHubConnected } from '@/lib/github/github-status'
import { NewJourneyForm } from '@/components/ProtectedUiComponents/new-journey-form'
import { db } from '@/db'
import { accounts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export default async function NewJourneyPage() {
  const session = await auth()
  if (!session) redirect('/login')
  
  // ✅ Fetch GitHub connection status on server
  const githubConnected = await hasGitHubConnected(session.user.id)
  
  // ✅ Get GitHub username if connected
  let githubUsername: string | null = null;
  if (githubConnected) {
    const githubAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, session.user.id),
        eq(accounts.provider, 'github')
      )
    })
    
    // GitHub stores username in providerAccountId or we can fetch from API
    githubUsername = githubAccount?.providerAccountId || null
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Journey
          </h1>
          <p className="mt-2 text-slate-600">
            Start a new learning journey or project
          </p>

          {/* ✅ Pass server data to client form */}
          <NewJourneyForm 
            githubConnected={githubConnected}
            githubUsername={githubUsername}
          />
        </div>
      </main>
    </div>
  )
}
