import { JOURNEY_ICONS, JOURNEY_COLORS } from '@/lib/constant/icons';

interface ArcStatsProps {
  totalCheckIns: number
  targetCheckIns: number
  longestStreak: number
  missedDays: number
  totalCommits: number
  journeyDuration: number
  completionRate: number
  totalWords: number
  pausedDays: number
  extendedDays: number
  isExtended: boolean
}

export function ArcStats({
  totalCheckIns,
  targetCheckIns,
  longestStreak,
  missedDays,
  totalCommits,
  journeyDuration,
  totalWords,
  pausedDays,
  extendedDays,
  isExtended,
}: ArcStatsProps) {
  const CheckInsIcon = JOURNEY_ICONS.checkIns
  const StreakIcon = JOURNEY_ICONS.LongestStreak
  const CommitsIcon = JOURNEY_ICONS.commits
  const WordsIcon = JOURNEY_ICONS.words
  const TimeIcon = JOURNEY_ICONS.time
  const PausedIcon = JOURNEY_ICONS.paused
  const ExtendedIcon = JOURNEY_ICONS.extended
  const TargetIcon = JOURNEY_ICONS.target

  const completedColors = JOURNEY_COLORS.completed
  const streakColors = JOURNEY_COLORS.streak
  const neutralColors = JOURNEY_COLORS.neutral
  const seedColors = JOURNEY_COLORS.seed
  const activeColors = JOURNEY_COLORS.active
  const pausedColors = JOURNEY_COLORS.paused
  const arcColors = JOURNEY_COLORS.arc
  const deadColors = JOURNEY_COLORS.dead

  const avgDailyWords = totalCheckIns > 0 ? Math.round(totalWords / totalCheckIns) : 0

  // Core stats (always show)
  const coreStats = [
    {
      icon: CheckInsIcon,
      label: 'Check-ins Completed',
      value: `${totalCheckIns}/${targetCheckIns}`,
      colors: completedColors,
    },
    {
      icon: StreakIcon,
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      colors: streakColors,
    },
    {
      icon: TimeIcon,
      label: 'Journey Duration',
      value: `${journeyDuration} days`,
      colors: activeColors,
    },
    {
      icon: TargetIcon,
      label: 'Missed Days',
      value: missedDays.toString(),
      colors: deadColors,
    },
    {
      icon: CommitsIcon,
      label: 'Total Commits',
      value: totalCommits > 0 ? totalCommits.toString() : 'N/A',
      colors: neutralColors,
    },
    {
      icon: ExtendedIcon,
      label: 'Extended Days',
      value: `${extendedDays} days`,
      colors: arcColors,
    },
    {
      icon: PausedIcon,
      label: 'Paused Days',
      value: `${pausedDays} days`,
      colors: pausedColors,
    }
  ]




  const allStats = [...coreStats]

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Journey Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`group relative rounded-xl ${stat.colors.bg} border ${stat.colors.border} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className="mb-3">
                <div className={`inline-flex p-2 rounded-lg ${stat.colors.badge}`}>
                  <Icon className={`h-5 w-5 ${stat.colors.icon}`} />
                </div>
              </div>

              {/* Value */}
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-xs text-slate-600">
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}