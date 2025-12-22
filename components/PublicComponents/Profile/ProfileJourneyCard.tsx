import Link from 'next/link'
import { Sprout, Trophy, Flame, GitBranch, Calendar, ArrowRight,Activity } from 'lucide-react'
import type { journeys } from '@/db/schema'

type Journey = typeof journeys.$inferSelect

interface ProfileJourneyCardProps {
  journey: Journey
  isOwnProfile: boolean
  daysSinceLastCheckIn: number
}

export function ProfileJourneyCard({ 
  journey, 
  isOwnProfile, 
  daysSinceLastCheckIn 
}: ProfileJourneyCardProps) {
  // Determine the correct link
  const href = journey.status === 'completed' 
    ? `/arc/${journey.id}` 
    : `/journey/${journey.id}`

  const getStatusColor = () => {
    switch (journey.status) {
      case 'completed':
        return 'bg-orange-50 border-orange-200/60 hover:border-orange-300'
      case 'active':
        return 'bg-white border-slate-200 hover:border-blue-300'
      case 'frozen':
        return 'bg-blue-50 border-blue-200/60 hover:border-blue-300'
      case 'dead':
        return 'bg-red-50 border-red-200/60 hover:border-red-300'
      default:
        return 'bg-white border-slate-200 hover:border-slate-300'
    }
  }

  return (
    <div
      className={`group relative rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}
    >
      {/* Status Badge (Top Right) */}
      <div className="absolute top-4 right-4 flex gap-2">
        {journey.status === 'completed' && (
          <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 border border-orange-200">
            <Trophy className="h-3 w-3" />
            <span>Completed</span>
          </div>
        )}
        
        {journey.status === 'frozen' && (
          <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
            <span>❄️</span>
            <span>Frozen</span>
          </div>
        )}
        
        {journey.status === 'dead' && (
          <div className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 border border-red-200">
            <span>💀</span>
            <span>Dead</span>
          </div>
        )}

        {!journey.isPublic && isOwnProfile && (
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
            🔒 Private
          </div>
        )}
      </div> 

      {/* Phase Badge */}
      <div className="mb-3 flex gap-2">
        {journey.phase === 'seed' ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <Sprout className="h-3 w-3" />
            <span>Seed</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700 border border-orange-200">
            <Trophy className="h-3 w-3" />
            <span>Arc</span>
          </div>
        )}
        {(journey.status === 'active') && <div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200">
            <Activity className='h-3 w-3'/>
            <span>Active</span>
          </div>
          </div>}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 pr-24">
        {journey.title.length>30 ? journey.title.slice(0,30)+"...":journey.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
        {journey.description.length>60? journey.description.slice(0,30)+"...":journey.description}
      </p>

      {/* Tech Stack */}
      {journey.techStack && journey.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {journey.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200"
            >
              {tech}
            </span>
          ))}
          {journey.techStack.length > 4 && (
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 border border-slate-200">
              +{journey.techStack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-4 pt-4 border-t border-slate-200">
        {/* Progress */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{journey.totalCheckIns}/{journey.targetCheckIns}</span>
        </div>

        {/* Streak */}
        {journey.currentStreak > 0 && (
          <>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-orange-600">
              <Flame className="h-4 w-4" />
              <span className="font-medium">{journey.currentStreak} day streak</span>
            </div>
          </>
        )}

        {/* Days since check-in warning */}
        {journey.status === 'active' && daysSinceLastCheckIn > 0 && (
          <>
            <span className="text-slate-300">•</span>
            <span className={daysSinceLastCheckIn >= 2 ? 'text-yellow-600 font-medium' : 'text-slate-600'}>
              {daysSinceLastCheckIn}d ago
            </span>
          </>
        )}

        {/* Repo indicator */}
        {journey.repoURL && (
          <>
            <span className="text-slate-300">•</span>
            <GitBranch className="h-4 w-4 text-slate-500" />
          </>
        )}
      </div>

      {
        (isOwnProfile || journey.completedAt) && 
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all"
      >
        <span>{journey.status === 'completed' ? 'View Arc' : 'View Journey'}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
      }
    </div>
  )
}