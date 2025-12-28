import { JOURNEY_ICONS, JOURNEY_COLORS } from "@/lib/constant/icons";
import { Zap } from "lucide-react";

interface ArcStatsProps {
  totalCheckIns: number;
  targetCheckIns: number;
  originalTarget: number | null;
  longestStreak: number;
  missedDays: number;
  totalCommits: number;
  journeyDuration: number;
  completionRate: number;
  totalWords: number;
  pausedDays: number;
  extendedDays: number;
  isExtended: boolean;
}

export function ArcStats({
  totalCheckIns,
  targetCheckIns,
  originalTarget,
  longestStreak,
  missedDays,
  totalCommits,
  journeyDuration,
  pausedDays,
  extendedDays,
  isExtended,
}: ArcStatsProps) {
  const CheckInsIcon = JOURNEY_ICONS.checkIns;
  const StreakIcon = JOURNEY_ICONS.LongestStreak;
  const CommitsIcon = JOURNEY_ICONS.commits;
  const TimeIcon = JOURNEY_ICONS.time;
  const PausedIcon = JOURNEY_ICONS.paused;
  const ExtendedIcon = JOURNEY_ICONS.extended;
  const TargetIcon = JOURNEY_ICONS.target;

  const completedColors = JOURNEY_COLORS.completed;
  const streakColors = JOURNEY_COLORS.streak;
  const neutralColors = JOURNEY_COLORS.neutral;
  const activeColors = JOURNEY_COLORS.active;
  const pausedColors = JOURNEY_COLORS.paused;
  const arcColors = JOURNEY_COLORS.arc;
  const deadColors = JOURNEY_COLORS.dead;

  // Calculate if completed early
  const completedEarly = isExtended && totalCheckIns < targetCheckIns;
  const daysAhead = completedEarly ? targetCheckIns - totalCheckIns : 0;

  // Core stats (always show)
  const coreStats = [
    // Check-ins - different display for extended vs normal
    isExtended
      ? {
          icon: CheckInsIcon,
          label: "Check-ins Completed",
          value: `${totalCheckIns}/${originalTarget}`,
          subtext: "Original target completed ✓",
          colors: completedColors,
        }
      : {
          icon: CheckInsIcon,
          label: "Check-ins Completed",
          value: `${totalCheckIns}/${targetCheckIns}`,
          colors: completedColors,
        },
    {
      icon: StreakIcon,
      label: "Longest Streak",
      value: `${longestStreak} ${longestStreak <= 1 ? " day" : " days"}`,
      colors: streakColors,
    },{
      icon: CommitsIcon,
      label: "Total Commits",
      value: totalCommits > 0 ? totalCommits.toString() : "N/A",
      colors: neutralColors,
    },
    {
      icon: TimeIcon,
      label: "Journey Duration",
      value: `${journeyDuration} ${journeyDuration <= 1 ? " day" : " days"}`,
      colors: activeColors,
    },
    {
      icon: TargetIcon,
      label: "Missed Days",
      value: missedDays.toString(),
      colors: deadColors,
    },
    {
      icon: PausedIcon,
      label: "Paused Days",
      value: `${pausedDays} ${pausedDays <= 1 ? " day" : " days"}`,
      colors: pausedColors,
    },
  ].filter(Boolean);

  // Conditional stats (only show if applicable)
  const conditionalStats = [];

  // Show "Completed Early" if extended and finished before target
  if (completedEarly && daysAhead > 0) {
    conditionalStats.push({
      icon: Zap,
      label: "Completed Early",
      value: `${daysAhead} ${daysAhead <= 1 ? " day" : " days"} ahead`,
      subtext: `Extended to ${targetCheckIns}, finished at ${totalCheckIns}`,
      colors: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-100",
        icon: "text-emerald-600",
      },
    });
  }

  // Show "Extended Days Used" if extended (actual days used, not total available)
  if (isExtended && originalTarget) {
    conditionalStats.push({
      icon: ExtendedIcon,
      label: "Extended Days Used",
      value: `${extendedDays}/${targetCheckIns - originalTarget}`,
      subtext: completedEarly
        ? "Finished ahead of schedule"
        : "Used all extended days",
      colors: arcColors,
    });
  }else{
   conditionalStats.push({
      icon: ExtendedIcon,
      label: "Extended Days",
      value: `0`,
      colors: arcColors,
    })
  }

  const allStats = [...coreStats, ...conditionalStats];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Journey Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`group relative rounded-xl ${stat.colors.bg} border ${stat.colors.border} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className="mb-3">
                <div
                  className={`inline-flex p-2 rounded-lg ${stat.colors.badge}`}
                >
                  <Icon className={`h-5 w-5 ${stat.colors.icon}`} />
                </div>
              </div>

              {/* Value */}
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-xs text-slate-600 mb-1">{stat.label}</div>

              {/* Subtext (optional) */}
              {stat.subtext && (
                <div className="text-xs text-slate-500 mt-1">
                  {stat.subtext}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
