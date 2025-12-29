// app/journey/[id]/check-in/loading.tsx

export default function CheckInLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Form Card Skeleton */}
        <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          {/* Date Field */}
          <div className="mb-6">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Accomplishment Field */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-32 w-full bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-48 bg-slate-200 rounded animate-pulse mt-2" />
          </div>

          {/* Notes Field */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-40 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* GitHub Commits Section */}
          <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <div className="h-11 flex-1 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-11 w-24 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}