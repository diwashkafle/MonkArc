import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserJourneys, getJourneyStats, isJourneyStuckInArc, isExtendedJourneyStuckInArc } from '@/lib/queries/journey-queries'
import { DashboardFilters } from '@/components/ProtectedUiComponents/journeys/dashboard-filters'
import Link from 'next/link'
import { JOURNEY_ICONS, JOURNEY_COLORS } from '@/lib/constant/icons';
import { shouldShowGitHubWarning } from '@/lib/github/github-status'
import { LinkGitHubWarning } from '@/components/ProtectedUiComponents/warnings/link-github-warning'
import { hasCheckedInToday } from '@/lib/queries/check-in-queries'
import { ToastHandler } from '@/components/toast/toast-handler'

export default async function DashboardPage() {

  const session = await auth()
  
  if (!session?.user?.id) { 
    redirect('/login')
  }

const showGitHubWarning = await shouldShowGitHubWarning(session.user.id);
  
  // Fetch user's journeys
  const journeys = await getUserJourneys(session.user.id)

  const stats = await getJourneyStats(session.user.id)

  // Get icon components
  const ActiveIcon = JOURNEY_ICONS.activeCount
  const SeedIcon = JOURNEY_ICONS.seed
  const ArcIcon = JOURNEY_ICONS.arc
  const StreakIcon = JOURNEY_ICONS.LongestStreak
  const CheckInsIcon = JOURNEY_ICONS.checkIns

  // Get colors
  const activeColors = JOURNEY_COLORS.active
  const seedColors = JOURNEY_COLORS.seed
  const arcColors = JOURNEY_COLORS.arc
  const streakColors = JOURNEY_COLORS.streak
  const checkInsColors = JOURNEY_COLORS.neutral

  const journeysWithStatus = await Promise.all(
  journeys.map(async (journey) => ({
    ...journey,
    isCheckedInToday: await hasCheckedInToday(journey.id),
    isStuckInArc: await isJourneyStuckInArc(journey.id, session.user.id),
    isExtendedStuckInArc: await isExtendedJourneyStuckInArc(journey.id, session.user.id),
  }))
)
  
  return (
    <div className="min-h-screen bg-slate-50">
      <ToastHandler/>
       {
        showGitHubWarning && <LinkGitHubWarning userName={session.user.name}/>
      }
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Your Dashboard, {session.user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create new journey of your learning by building.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Active Journeys */}
          <div className={`group rounded-xl ${activeColors.bg} border ${activeColors.border} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <ActiveIcon className={`h-4 w-4 ${activeColors.icon}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.active}
            </div>
            <div className="text-xs text-slate-600 mt-1">Active Journeys</div>
          </div>
          
          {/* Seeds */}
          <div className={`group rounded-xl ${seedColors.bg} border ${seedColors.border} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <SeedIcon className={`h-4 w-4 ${seedColors.icon}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.seeds}
            </div>
            <div className="text-xs text-slate-600 mt-1">Seeds</div>
          </div>

          {/* Arcs */}
          <div className={`group rounded-xl ${arcColors.bg} border ${arcColors.border} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <ArcIcon className={`h-4 w-4 ${arcColors.icon}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.arcs}
            </div>
            <div className="text-xs text-slate-600 mt-1">Arcs</div>
          </div>
          
          {/* Longest Streak */}
          <div className={`group rounded-xl ${streakColors.bg} border ${streakColors.border} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <StreakIcon className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.longestStreak}
            </div>
            <div className="text-xs text-slate-600 mt-1">Longest Streak</div>
          </div>
          
          {/* Total Check-ins */}
          <div className={`group rounded-xl ${checkInsColors.bg} border ${checkInsColors.border} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <CheckInsIcon className={`h-4 w-4 ${checkInsColors.icon}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalCheckIns}
            </div>
            <div className="text-xs text-slate-600 mt-1">Total Check-ins</div>
          </div>
        </div>
        
        {/* Journeys Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Your Journeys</h3>
            <Link
              href="/journey/new"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              + New Journey
            </Link>
          </div>
          
          {/* Journey List with Filters */}
          {journeys.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                <SeedIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">
                No journeys yet
              </h4>
              <p className="mt-2 text-slate-600">
                Create your first journey to start your MonkArc experience.
              </p>
              <Link
                href="/journey/new"
                className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Create First Journey
              </Link>
            </div>
          ) : ( 
            <DashboardFilters journeys={journeysWithStatus} /> 
          )}
        </div>
      </main>
    </div>
  )
}