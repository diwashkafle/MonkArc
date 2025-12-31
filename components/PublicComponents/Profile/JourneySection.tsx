import Link from 'next/link'
import { ProfileJourneyCard } from './ProfileJourneyCard'
import type { journeys } from '@/db/schema'

type Journey = typeof journeys.$inferSelect

interface JourneysSectionProps {
  journeys: Journey[]
  isOwnProfile: boolean
  daysSinceLastCheckIn: (lastCheckInDate: string | null) => number
}

export function JourneysSection({ 
  journeys, 
  isOwnProfile, 
  daysSinceLastCheckIn 
}: JourneysSectionProps) {
  // Separate journeys by status
  const activeJourneys = journeys.filter(j => 
    j.status === 'active' || j.status === 'frozen' || j.status === 'extended' || j.status === 'scheduled'
  )
  const completedJourneys = journeys.filter(j => j.status === 'completed')
  const deadJourneys = journeys.filter(j => j.status === 'dead')

  return (
    <div className="space-y-8">
      {/* Active/Frozen Journeys */}
      {activeJourneys.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isOwnProfile ? 'Active Journeys' : 'Active Journeys'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {activeJourneys.length} {activeJourneys.length === 1 ? 'journey' : 'journeys'} in progress
              </p>
            </div>
            {isOwnProfile && (
              <Link
                href="/journey/new"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                + New Journey
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeJourneys.map((journey) => (
              <ProfileJourneyCard
                key={journey.id}
                journey={journey}
                isOwnProfile={isOwnProfile}
                daysSinceLastCheckIn={daysSinceLastCheckIn(journey.lastCheckInDate)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Arcs */}
      {completedJourneys.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Completed Arcs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {completedJourneys.length} {completedJourneys.length === 1 ? 'journey' : 'journeys'} completed
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedJourneys.map((journey) => (
              <ProfileJourneyCard
                key={journey.id}
                journey={journey}
                isOwnProfile={isOwnProfile}
                daysSinceLastCheckIn={0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dead Journeys */}
      {deadJourneys.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Dead Journeys
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {deadJourneys.length} {deadJourneys.length === 1 ? 'journey' : 'journeys'} abandoned
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadJourneys.map((journey) => (
              <ProfileJourneyCard
                key={journey.id}
                journey={journey}
                isOwnProfile={isOwnProfile}
                daysSinceLastCheckIn={daysSinceLastCheckIn(journey.lastCheckInDate)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}