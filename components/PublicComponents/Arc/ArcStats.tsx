import { Target, Flame, TrendingUp, GitCommit, Calendar, Award, FileText, BarChart3 } from 'lucide-react'

interface ArcStatsProps {
  totalCheckIns: number
  targetCheckIns: number
  longestStreak: number
  missedDays: number
  totalCommits: number
  journeyDuration: number
  completionRate: number
  totalWords: number
}

export function ArcStats({
  totalCheckIns,
  targetCheckIns,
  longestStreak,
  missedDays,
  totalCommits,
  journeyDuration,
  completionRate,
  totalWords
}: ArcStatsProps) {
  const stats = [
    {
      icon: Target,
      label: 'Check-ins Completed',
      value: `${totalCheckIns} / ${targetCheckIns}`,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200/60'
    },
    {
      icon: Flame,
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200/60'
    },
    {
      icon: Calendar,
      label: 'Journey Duration',
      value: `${journeyDuration} days`,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200/60'
    },
    {
      icon: BarChart3,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200/60'
    },
    {
      icon: TrendingUp,
      label: 'Missed Days',
      value: missedDays.toString(),
      color: 'slate',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600',
      borderColor: 'border-slate-200/60'
    },
    {
      icon: GitCommit,
      label: 'Total Commits',
      value: totalCommits > 0 ? totalCommits.toString() : 'N/A',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200/60'
    },
  ]

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Journey Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`group relative rounded-xl ${stat.bgColor} border ${stat.borderColor} px-4 p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`mb-3 ${stat.iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Value */}
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-slate-600">
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}