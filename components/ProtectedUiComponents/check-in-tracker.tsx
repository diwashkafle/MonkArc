'use client'

import { format, addDays, differenceInDays, startOfDay, isBefore } from 'date-fns'

interface CheckIn {
  id: string
  date: string
  journal: string
}

interface CheckInTrackerProps {
  startDate: Date | string
  targetCheckIns: number
  checkIns: CheckIn[]
  currentCheckIns: number
}

export function CheckInTracker({
  startDate,
  targetCheckIns,
  checkIns,
  currentCheckIns,
}: CheckInTrackerProps) {
  const start = startOfDay(new Date(startDate))
  const today = startOfDay(new Date())
  
  // Days elapsed since journey started
  const daysElapsed = differenceInDays(today, start)
  
  // Create map for quick lookup
  const checkInMap = new Map(checkIns.map(ci => [ci.date, ci]))
  
  // Show all days from start to today (or target, whichever is larger)
  const totalBoxes = Math.max(daysElapsed + 1, targetCheckIns)
  
  // Generate boxes
  const boxes = Array.from({ length: totalBoxes }, (_, index) => {
    const boxDate = addDays(start, index)
    const dateStr = format(boxDate, 'yyyy-MM-dd')
    const hasCheckIn = checkInMap.has(dateStr)
    const isToday = dateStr === format(today, 'yyyy-MM-dd')
    const isPast = isBefore(boxDate, today)
    const isFuture = !isPast && !isToday
    
    return {
      date: boxDate,
      dateStr,
      hasCheckIn,
      isToday,
      isPast,
      isFuture,
      dayNumber: index + 1,
    }
  })
  
  // Calculate stats
  const completedCount = boxes.filter(b => b.hasCheckIn).length
  const missedCount = boxes.filter(b => b.isPast && !b.hasCheckIn).length
  const remainingCount = Math.max(0, targetCheckIns - currentCheckIns)
  
  // Calculate current streak
  let currentStreak = 0
  for (let i = boxes.length - 1; i >= 0; i--) {
    const box = boxes[i]
    if (box.isFuture) continue
    if (box.isToday && !box.hasCheckIn) break
    if (box.hasCheckIn) {
      currentStreak++
    } else {
      break
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Progress Tracker
          </h3>
          {currentStreak > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              🔥 {currentStreak} day streak
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">
            {currentCheckIns} / {targetCheckIns}
          </div>
          <div className="text-sm text-slate-600">
            {Math.round((currentCheckIns / targetCheckIns) * 100)}% complete
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${Math.min((currentCheckIns / targetCheckIns) * 100, 100)}%`,
          }}
        />
      </div>
      
      {/* Box Grid */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-1.5">
          {boxes.map((box) => {
            // Determine status
            let bgColor = 'bg-slate-100'
            let borderColor = 'border-slate-200'
            
            if (box.hasCheckIn) {
              // Checked in - Green
              bgColor = 'bg-emerald-500'
              borderColor = 'border-emerald-500'
            } else if (box.isPast) {
              // Past missed - Red
              bgColor = 'bg-red-100'
              borderColor = 'border-red-300'
            } else if (box.isToday) {
              // Today - Just blue ring, no red background
              bgColor = 'bg-slate-50'
              borderColor = 'border-slate-300'
            } else {
              // Future - Gray
              bgColor = 'bg-slate-50'
              borderColor = 'border-slate-200'
            }
            
            return (
              <div
                key={box.dateStr}
                className="group relative"
              >
                {/* Box - Smaller and cleaner */}
                <div
                  className={`
                    h-7 w-7 rounded border-2 
                    transition-all duration-200
                    ${bgColor} ${borderColor}
                    ${box.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    hover:scale-125 hover:shadow-lg hover:z-10
                    cursor-pointer
                  `}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block z-20 whitespace-nowrap">
                  <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                    {/* Date with month */}
                    <div className="font-semibold">
                      {format(box.date, 'EEE, MMM d, yyyy')}
                    </div>
                    
                    {/* Day number */}
                    <div className="mt-1 text-slate-400">
                      Day {box.dayNumber}
                    </div>
                    
                    {/* Status */}
                    <div className="mt-1">
                      {box.hasCheckIn && (
                        <span className="text-emerald-400">✓ Checked in</span>
                      )}
                      {box.isPast && !box.hasCheckIn && (
                        <span className="text-red-400">✕ Missed</span>
                      )}
                      {box.isToday && (
                        <span className="text-blue-400">📅 Today</span>
                      )}
                      {box.isFuture && (
                        <span className="text-slate-400">Upcoming</span>
                      )}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 bg-slate-900" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-500" />
          <span>Checked in</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded border-2 border-red-300 bg-red-100" />
          <span>Missed</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded border-2 border-blue-500 ring-2 ring-blue-500 ring-offset-1 bg-slate-50" />
          <span>Today</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded border-2 border-slate-200 bg-slate-50" />
          <span>Upcoming</span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
          <div className="text-2xl font-bold text-emerald-700">
            {completedCount}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Completed</div>
        </div>
        
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
          <div className="text-2xl font-bold text-red-700">
            {missedCount}
          </div>
          <div className="text-xs text-red-600 mt-1">Missed</div>
        </div>
        
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-center">
          <div className="text-2xl font-bold text-orange-700">
            {currentStreak}
          </div>
          <div className="text-xs text-orange-600 mt-1">Streak</div>
        </div>
        
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
          <div className="text-2xl font-bold text-slate-700">
            {remainingCount}
          </div>
          <div className="text-xs text-slate-600 mt-1">Remaining</div>
        </div>
      </div>
    </div>
  )
}
