import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ensureUsername } from '@/lib/server-actions/user-action'
import { getUserJourneys, getJourneyStats } from '@/lib/queries/journey-queries'
import { DashboardFilters } from '@/components/ProtectedUiComponents/journeys/dashboard-filters'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }
  
  // Ensure username exists
  await ensureUsername(
    session.user.id,
    session.user.name || '',
    session.user.email || ''
  )
  
  // Fetch user's journeys
  const journeys = await getUserJourneys(session.user.id)
  const stats = await getJourneyStats(session.user.id)
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
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
      
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {session.user.name}! 🎉
          </h2>
          <p className="mt-1 text-slate-600">
            Your journey continues.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">Active Journeys</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">
              {stats.active}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">Arcs Achieved</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.arcs} 🎋
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">Longest Streak</div>
            <div className="mt-2 text-3xl font-bold text-orange-600">
              {stats.longestStreak} 🔥
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">Total Check-ins</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {stats.totalCheckIns}
            </div>
          </div>
        </div>
        
        {/* Journeys Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Your Journeys</h3>
            <Link
              href="/journey/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + New Journey
            </Link>
          </div>
          
          {/* Journey List with Filters */}
          {journeys.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <div className="text-6xl">🌱</div>
              <h4 className="mt-4 text-lg font-semibold text-slate-900">
                No journeys yet
              </h4>
              <p className="mt-2 text-slate-600">
                Create your first journey to start your MonkArc experience.
              </p>
              <Link
                href="/journey/new"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Create First Journey
              </Link>
            </div>
          ) : (
            <DashboardFilters journeys={journeys} />
          )}
        </div>
      </main>
    </div>
  )
}