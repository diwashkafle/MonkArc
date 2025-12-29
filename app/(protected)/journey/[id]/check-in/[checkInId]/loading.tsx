// app/journey/[id]/check-in/[checkInId]/loading.tsx

export default function CheckInDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* Check-in Card Skeleton */}
        <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-64 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Accomplishment Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-emerald-100 rounded-lg animate-pulse" />
              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-blue-100 rounded-lg animate-pulse" />
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          {/* GitHub Commits Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-purple-100 rounded-lg animate-pulse" />
              <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}