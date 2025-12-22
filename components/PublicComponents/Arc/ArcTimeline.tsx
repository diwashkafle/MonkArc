import { Calendar, GitCommit, FileText } from 'lucide-react'
import type { dailyProgress } from '@/db/schema'
type CheckIn = typeof dailyProgress.$inferSelect

interface ArcTimelineProps {
  checkIns: CheckIn[]
}



export function ArcTimeline({ checkIns }: ArcTimelineProps
) {
  if (checkIns.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-slate-600">No check-ins recorded</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Journey Timeline</h2>
        <div className="text-sm text-slate-500">
          {checkIns.length} {checkIns.length === 1 ? 'check-in' : 'check-ins'}
        </div>
      </div>

      <div className="space-y-6">
        {checkIns.map((checkIn, index) => {
          const checkInDate = new Date(checkIn.date)
          const formattedDate = checkInDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })

          const isFirst = index === 0
          const isLast = index === checkIns.length - 1

          return (
            <div key={checkIn.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-linear-to-b from-orange-200 to-transparent" />
              )}

              {/* Check-in card */}
              <div className="relative flex gap-4">
                {/* Timeline dot */}
                <div 
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isFirst 
                      ? 'bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30' 
                      : 'bg-white border-2 border-orange-300'
                  }`}
                >
                  {isFirst ? (
                    <Calendar className="h-5 w-5 text-white" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-5 hover:bg-white hover:border-orange-200 transition-all duration-300">
                  {/* Date and prompt */}
                  <div className="mb-3">
                    <div className="font-semibold text-slate-900 mb-1">
                      {formattedDate}
                    </div>
                    <div className="text-sm text-slate-500">
                      Prompt: <span className="text-slate-700">{checkIn.promptUsed}</span>
                    </div>
                  </div>

                  {/* Accomplishment text */}
                  <div className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {checkIn.accomplishment}
                  </div>

                  {/* Notes (if any) */}
                  {checkIn.notes && (
                    <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <div className="text-xs font-medium text-blue-700 mb-1">Notes</div>
                      <div className="text-sm text-blue-900 whitespace-pre-wrap">{checkIn.notes}</div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>{checkIn.wordCount} words</span>
                    </div>

                    {checkIn.commitCount > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <GitCommit className="h-4 w-4" />
                          <span>{checkIn.commitCount} commits</span>
                        </div>
                      </>
                    )}

                    {checkIn.editedAt && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600">Edited</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}