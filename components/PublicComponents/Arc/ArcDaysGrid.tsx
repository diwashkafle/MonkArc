import type { dailyProgress } from '@/db/schema'

type CheckIn = typeof dailyProgress.$inferSelect

interface ArcDaysGridProps {
  startDate: string
  completedAt: Date
  checkIns: CheckIn[]
}

export function ArcDaysGrid({ startDate, completedAt, checkIns }: ArcDaysGridProps) {
  // Create a map of dates that have check-ins
  const checkInDates = new Set(
    checkIns.map(c => new Date(c.date).toISOString().split('T')[0])
  )

  // Generate array of all days from start to completion
  const start = new Date(startDate)
  const end = new Date(completedAt)
  const days: { date: Date; hasCheckIn: boolean }[] = []

  const current = new Date(start)
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0]
    days.push({
      date: new Date(current),
      hasCheckIn: checkInDates.has(dateStr)
    })
    current.setDate(current.getDate() + 1)
  }

  // Group days by month for better visualization
  const monthGroups: { [key: string]: typeof days } = {}
  days.forEach(day => {
    const monthKey = day.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = []
    }
    monthGroups[monthKey].push(day)
  })

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Daily Progress Grid</h2>
        <p className="text-sm text-slate-500">
          Visual representation of your entire journey
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-500" />
          <span className="text-slate-600">Checked in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-slate-200" />
          <span className="text-slate-600">Missed</span>
        </div>
      </div>

      {/* Month-by-month grid */}
      <div className="flex gap-4 flex-col">
        {Object.entries(monthGroups).map(([month, monthDays]) => (
          <div key={month}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{month}</h3>
            <div className="flex flex-wrap gap-3">
              {monthDays.map((day, index) => {
                const dayNum = day.date.getDate()
                const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' })
                
                return (
                  <div
                    key={index}
                    className="group relative "
                    title={`${dayName}, ${day.date.toLocaleDateString()} - ${day.hasCheckIn ? 'Checked in' : 'Missed'}`}
                  >
                    <div
                      className={` h-8 w-8 rounded-lg transition-all duration-300 flex items-center justify-center text-xs font-medium ${
                        day.hasCheckIn
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110 shadow-sm'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                    >
                      {dayNum}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {dayName}, {day.date.toLocaleDateString()}
                        <div className="text-center text-[10px] text-slate-400">
                          {day.hasCheckIn ? '✓ Checked in' : '✗ Missed'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-slate-900">{days.length}</div>
          <div className="text-xs text-slate-500">Total Days</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-600">{checkIns.length}</div>
          <div className="text-xs text-slate-500">Check-ins</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-600">
            {days.length - checkIns.length}
          </div>
          <div className="text-xs text-slate-500">Missed</div>
        </div>
      </div>
    </div>
  )
}