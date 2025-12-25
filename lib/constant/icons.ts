import {
  Sprout,        // Seed phase
  Trophy,        // Arc phase / Completed
  Zap,           // Active
  Pause,         // Paused
  Snowflake,     // Frozen
  Skull,         // Dead
  Flame,         // Streak
  Calendar,      // Total check-ins
  Target,        // Journey target
  TrendingUp,    // Growth/Progress
  CheckCircle,   // Completed status
  Clock,         // Time/Duration
  GitCommit,     // Commits
  FileText,      // Words/Content
  Activity,      // Active journeys count
  type LucideIcon,
} from 'lucide-react'

// Icon mapping for all journey-related statuses and metrics
export const JOURNEY_ICONS = {
  // Phase
  seed: Sprout,
  arc: Trophy,
  
  // Status
  active: Zap,
  paused: Pause,
  frozen: Snowflake,
  dead: Skull,
  completed: Trophy,
  extended: TrendingUp,
  
  // Metrics
  LongestStreak: TrendingUp,
  currentStreak: Flame,
  checkIns: Calendar,
  target: Target,
  commits: GitCommit,
  words: FileText,
  activeCount: Activity,
  
  // Generic
  progress: TrendingUp,
  time: Clock,
  success: CheckCircle,
} as const

// Type for icon keys
export type JourneyIconKey = keyof typeof JOURNEY_ICONS

// Color system for consistent theming
export const JOURNEY_COLORS = {
  seed: {
    bg: 'bg-emerald-50',
    bgHover: 'hover:bg-emerald-100',
    border: 'border-emerald-200/60',
    borderHover: 'hover:border-emerald-300',
    text: 'text-emerald-700',
    textDark: 'text-emerald-900',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
  arc: {
    bg: 'bg-orange-50',
    bgHover: 'hover:bg-orange-100',
    border: 'border-orange-200/60',
    borderHover: 'hover:border-orange-300',
    text: 'text-orange-700',
    textDark: 'text-orange-900',
    icon: 'text-orange-600',
    badge: 'bg-orange-100',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
  },
  active: {
    bg: 'bg-blue-50',
    bgHover: 'hover:bg-blue-100',
    border: 'border-blue-200/60',
    borderHover: 'hover:border-blue-300',
    text: 'text-blue-700',
    textDark: 'text-blue-900',
    icon: 'text-blue-600',
    badge: 'bg-blue-100',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
  },
  paused: {
    bg: 'bg-slate-50',
    bgHover: 'hover:bg-slate-100',
    border: 'border-slate-200/60',
    borderHover: 'hover:border-slate-300',
    text: 'text-slate-700',
    textDark: 'text-slate-900',
    icon: 'text-slate-600',
    badge: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
  },
  frozen: {
    bg: 'bg-cyan-50',
    bgHover: 'hover:bg-cyan-100',
    border: 'border-cyan-200/60',
    borderHover: 'hover:border-cyan-300',
    text: 'text-cyan-700',
    textDark: 'text-cyan-900',
    icon: 'text-cyan-600',
    badge: 'bg-cyan-100',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
  },
  dead: {
    bg: 'bg-red-50',
    bgHover: 'hover:bg-red-100',
    border: 'border-red-200/60',
    borderHover: 'hover:border-red-300',
    text: 'text-red-700',
    textDark: 'text-red-900',
    icon: 'text-red-600',
    badge: 'bg-red-100',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
  },
  completed: {
    bg: 'bg-purple-50',
    bgHover: 'hover:bg-purple-100',
    border: 'border-purple-200/60',
    borderHover: 'hover:border-purple-300',
    text: 'text-purple-700',
    textDark: 'text-purple-900',
    icon: 'text-purple-600',
    badge: 'bg-purple-100',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
  },
  streak: {
    bg: 'bg-amber-50',
    bgHover: 'hover:bg-amber-100',
    border: 'border-amber-200/60',
    borderHover: 'hover:border-amber-300',
    text: 'text-amber-700',
    textDark: 'text-amber-900',
    icon: 'text-amber-600',
    badge: 'bg-amber-100',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
  },
  neutral: {
    bg: 'bg-slate-50',
    bgHover: 'hover:bg-slate-100',
    border: 'border-slate-200/60',
    borderHover: 'hover:border-slate-300',
    text: 'text-slate-700',
    textDark: 'text-slate-900',
    icon: 'text-slate-600',
    badge: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
  },
} as const

// Helper function to get icon component
export function getJourneyIcon(key: JourneyIconKey): LucideIcon {
  return JOURNEY_ICONS[key]
}

// Helper function to get colors
export function getJourneyColors(type: keyof typeof JOURNEY_COLORS) {
  return JOURNEY_COLORS[type]
}