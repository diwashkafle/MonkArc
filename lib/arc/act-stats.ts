import type { dailyProgress } from '@/db/schema'

type CheckIn = typeof dailyProgress.$inferSelect

// Calculate total missed days in a journey
export function calculateMissedDays(
  startDate: string,
  completedAt: Date,
  totalCheckIns: number,
  pausedDays: number = 0
): number {
  const start = new Date(startDate)
  const end = new Date(completedAt)
  
  // Reset to midnight for accurate calculation
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  
  // Calculate total days in journey
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // Subtract paused days from total
  const activeDays = totalDays - pausedDays
  
  // Missed days = active days - check-ins
  const missedDays = Math.max(0, activeDays - totalCheckIns)
  
  return missedDays
}

// Calculate total commits from all check-ins
export function calculateTotalCommits(checkIns: CheckIn[]): number {
  return checkIns.reduce((total, checkIn) => total + (checkIn.commitCount || 0), 0)
}

// Calculate total words written
export function calculateTotalWords(checkIns: CheckIn[]): number {
  return checkIns.reduce((total, checkIn) => total + (checkIn.wordCount || 0), 0)
}

// Calculate journey duration in days
export function calculateJourneyDuration(
  startDate: string,
  completedAt: Date
): number {
  const start = new Date(startDate)
  const end = new Date(completedAt)
  
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

// Calculate completion rate (percentage of days checked in)
export function calculateCompletionRate(
  totalCheckIns: number,
  journeyDuration: number,
  pausedDays: number = 0
): number {
  const activeDays = journeyDuration - pausedDays
  if (activeDays <= 0) return 0
  
  return Math.round((totalCheckIns / activeDays) * 100)
}

// Get check-in frequency insights
export function getCheckInFrequency(checkIns: CheckIn[]): {
  mostProductiveDay: string
  averageWordCount: number
  totalDaysWithCommits: number
} {
  if (checkIns.length === 0) {
    return {
      mostProductiveDay: 'N/A',
      averageWordCount: 0,
      totalDaysWithCommits: 0
    }
  }

  // Count check-ins by day of week
  const dayCount: Record<string, number> = {}
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  checkIns.forEach(checkIn => {
    const date = new Date(checkIn.date)
    const dayName = days[date.getDay()]
    dayCount[dayName] = (dayCount[dayName] || 0) + 1
  })

  const mostProductiveDay = Object.entries(dayCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'

  const averageWordCount = Math.round(
    checkIns.reduce((sum, c) => sum + c.wordCount, 0) / checkIns.length
  )

  const totalDaysWithCommits = checkIns.filter(c => c.commitCount > 0).length

  return {
    mostProductiveDay,
    averageWordCount,
    totalDaysWithCommits
  }
}

// Format duration in human-readable format
export function formatDuration(days: number): string {
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'}`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    if (remainingDays === 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
    }
    return `${weeks}w ${remainingDays}d`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    if (remainingDays === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`
    }
    return `${months}mo ${remainingDays}d`
  } else {
    const years = Math.floor(days / 365)
    const remainingDays = days % 365
    if (remainingDays === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`
    }
    return `${years}y ${remainingDays}d`
  }
}