import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ensureUsername } from '@/lib/server-actions/user-action'
import { getUserJourneys, getJourneyStats } from '@/lib/queries/journey-queries'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  const now = new Date();
  // Ensure username exists
  await ensureUsername(
    session.user.id,
    session.user.name || '',
    session.user.email || ''
  )
  
  // Fetch user's journeys
  const journeys = await getUserJourneys(session.user.id)
  const stats = await getJourneyStats(session.user.id)
  
  console.log('========== DASHBOARD ==========')
  console.log('Journeys found:', journeys.length)
  console.log('Stats:', stats)
  console.log('===============================')
  
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

          
          
          {/* Journey List (will build in Step 2) */}
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
            <div className="space-y-4">
             {/* Inside the journey card mapping */}
{journeys.map((journey) => {
  const daysSince = journey.lastCheckInDate 
    ? Math.floor((now.getTime() - new Date(journey.lastCheckInDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  
  return (
    <div
      key={journey.id}
      className={`rounded-lg bg-white p-6 shadow-sm ${
        journey.status === 'frozen' ? 'border-2 border-blue-400' : 
        journey.status === 'dead' ? 'border-2 border-red-400' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {journey.status === 'dead' ? '💀' : 
               journey.status === 'frozen' ? '❄️' : 
               journey.phase === 'arc' ? '🎋' : '🌱'}
            </span>
            <h4 className="text-lg font-semibold text-slate-900">
              {journey.title}
            </h4>
            {journey.phase === 'arc' && journey.status !== 'dead' && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Arc
              </span>
            )}
            {journey.status === 'frozen' && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Frozen
              </span>
            )}
            {journey.status === 'dead' && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Dead
              </span>
            )}
            {journey.status === 'completed' && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                Completed
              </span>
            )}
          </div>
          
          <p className="mt-2 text-sm text-slate-600">
            {journey.description}
          </p>
          
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            <span>
              {journey.totalCheckIns}/{journey.targetCheckIns} check-ins
            </span>
            <span>•</span>
            <span>
              {journey.currentStreak > 0 
                ? `${journey.currentStreak} day streak 🔥` 
                : 'No current streak'}
            </span>
            {journey.status === 'active' && daysSince > 0 && (
              <>
                <span>•</span>
                <span className={daysSince >= 2 ? 'text-yellow-600 font-medium' : ''}>
                  {daysSince} {daysSince === 1 ? 'day' : 'days'} since last check-in
                </span>
              </>
            )}
          </div>
        </div>
        
        <Link
          href={`/journey/${journey.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View →
        </Link>
      </div>
    </div>
  )
})}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}