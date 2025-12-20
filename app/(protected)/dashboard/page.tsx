import { auth} from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ensureUsername } from '@/lib/server-actions/user-action'
import { getUserJourneys, getJourneyStats } from '@/lib/queries/journey-queries'
import { DashboardFilters } from '@/components/ProtectedUiComponents/journeys/dashboard-filters'
import Link from 'next/link'
import { SiAlwaysdata } from "react-icons/si";
import { FaCalendarCheck } from "react-icons/fa";
import { DiCodeigniter } from "react-icons/di";
import { SiCodefresh, SiCodeigniter } from 'react-icons/si'
import { GiAzulFlake } from 'react-icons/gi'

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
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm flex items-center gap-2 text-slate-600">Active Journeys  <span className='text-2xl'><SiAlwaysdata/></span></div>
            <div className="mt-2 text-2xl  font-bold text-slate-700">
             {stats.active}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm flex items-center gap-2 text-slate-600">Seeds <span className='text-2xl'><SiCodefresh/></span></div>
            <div className="mt-2 text-2xl font-bold text-gray-600">
              {stats.seeds}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm flex items-center gap-2 text-slate-600">Arcs <span className='text-2xl'><GiAzulFlake/></span></div>
            <div className="mt-2 text-2xl font-bold text-gray-600">
              {stats.arcs}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm flex items-center gap-2 text-slate-600">Longest Streak <span className='text-2xl'><DiCodeigniter/></span></div>
            <div className="mt-2 text-2xl font-bold text-gray-600">
              {stats.longestStreak}
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm flex items-center gap-2 text-slate-600">Total Check-ins<span className='text-2xl'><FaCalendarCheck/></span></div>
            <div className="mt-2 text-2xl font-bold text-gray-600">
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
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              + New Journey
            </Link>
          </div>
          
          {/* Journey List with Filters */}
          {journeys.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <h4 className="mt-4 text-lg font-semibold text-slate-900">
                No journeys yet
              </h4>
              <p className="mt-2 text-slate-600">
                Create your first journey to start your MonkArc experience.
              </p>
              <Link
                href="/journey/new"
                className="mt-6 inline-block rounded-lg bg-gray-600 px-6 py-3 font-medium text-white hover:bg-gray-700"
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