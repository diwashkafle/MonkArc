
export default function EditJourneyLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-72 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Form Card Skeleton */}
        <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200 space-y-6">
          
          {/* Journey Info Display */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Title Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Description Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-32 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Tech Stack */}
          <div>
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Repo URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Resources Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            
            <div className="space-y-3">
              {[...Array(1)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-80 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-11 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Warning Box */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 bg-amber-200 rounded animate-pulse shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-full bg-amber-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-amber-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <div className="h-12 flex-1 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-12 w-28 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}