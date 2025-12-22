import Image from 'next/image'
import { Trophy, Flame, CheckCircle, Target, Sprout, Activity } from 'lucide-react'
import type { users } from '@/db/schema'
import { ShareProfileButton } from '@/components/ProtectedUiComponents/journeys/share-profile-button'

type User = typeof users.$inferSelect

interface ProfileStats {
  totalSeeds: number
  totalArcs: number
  activeJourneys: number
  completedJourneys: number
  totalCheckIns: number
  longestStreak: number
}

interface ProfileHeaderProps {
  user: User
  stats: ProfileStats
  isOwnProfile: boolean
  profileUrl:string
}

export function ProfileHeader({ user, stats, isOwnProfile,profileUrl }: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl mt-10 bg-white border border-slate-200 p-8 shadow-sm">
      {/* User Info */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          {user.image && (
            <div className="relative">
              <Image
                src={user.image}
                alt={user.name || 'User'}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full ring-4 ring-slate-100"
              />
              {isOwnProfile && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user.name}
            </h1>
            <p className="mt-1 text-lg text-slate-600">@{user.username}</p>
            <p className="mt-2 text-sm text-slate-500">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="ml-4 mt-10 hidden md:block">
            <ShareProfileButton 
              profileUrl={profileUrl}
              username={user.username || 'user'}
            />
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Seeds */}
        <div className="group relative rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Sprout className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalSeeds}</div>
          <div className="text-xs text-slate-600 mt-1">Seeds</div>
        </div>

        {/* Arcs */}
        <div className="group relative rounded-xl bg-orange-50 border border-orange-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <Trophy className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalArcs}</div>
          <div className="text-xs text-slate-600 mt-1">Arcs</div>
        </div>

        {/* Active */}
        <div className="group relative rounded-xl bg-blue-50 border border-blue-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.activeJourneys}</div>
          <div className="text-xs text-slate-600 mt-1">Active</div>
        </div>

        {/* Completed */}
        <div className="group relative rounded-xl bg-purple-50 border border-purple-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.completedJourneys}</div>
          <div className="text-xs text-slate-600 mt-1">Completed</div>
        </div>

        {/* Longest Streak */}
        <div className="group relative rounded-xl bg-amber-50 border border-amber-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Flame className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.longestStreak}</div>
          <div className="text-xs text-slate-600 mt-1">Best Streak</div>
        </div>

        {/* Total Check-ins */}
        <div className="group relative rounded-xl bg-slate-50 border border-slate-200/60 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Target className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalCheckIns}</div>
          <div className="text-xs text-slate-600 mt-1">Check-ins</div>
        </div>
      </div>
    </div>
  )
}