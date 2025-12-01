import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ensureUsername } from '@/lib/server-actions/user-action'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  // This now runs MUCH faster (3 queries max, not N queries in a loop)
  await ensureUsername(
    session.user.id,
    session.user.name || '',
    session.user.email || ''
  )
  
  return (
   <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            🧘‍♂️ MonkArc
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${session.user.username}`}
              className="text-sm text-blue-600 hover:underline"
            >
              View Profile
            </Link>
            
            <Link
              href="/settings"
              className="text-sm text-slate-600 hover:underline"
            >
              Settings
            </Link>
            
            <span className="text-sm text-slate-600">
              {session.user.name}
            </span>
            
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome, {session.user.name}! 🎉
        </h2>
        <p className="mt-2 text-slate-600">
          Your journeys will appear here.
        </p>
      </main>
    </div>
  )
}


 