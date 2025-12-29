
export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-12">
        
        {/* Profile Header Card */}
        <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-slate-200 rounded-full animate-pulse shrink-0" />
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
              </div>

              {/* Bio */}
              <div className="mb-6 space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div>
                  <div className="h-7 w-12 bg-slate-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-7 w-12 bg-slate-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-7 w-12 bg-slate-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-8">
            {['Completed Arcs', 'Active Journeys', 'About'].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-slate-200 rounded-t animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow-sm border border-slate-200"
            >
              {/* Journey Card Skeleton */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-slate-200 rounded-full animate-pulse" />
              </div>

              <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
              
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Tech Stack Tags */}
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Alternative */}
        <div className="hidden first:block">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-64 bg-slate-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-80 bg-slate-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}