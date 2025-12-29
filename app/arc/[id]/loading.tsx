
export default function ArcLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Skeleton */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Header Skeleton */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse shrink-0" />
            
            {/* Content */}
            <div className="flex-1">
              <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
              
              {/* Tags */}
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="h-7 w-40 bg-slate-200 rounded animate-pulse mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-50 border border-slate-200 p-5"
              >
                <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse mb-3" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Days Grid Skeleton */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-6" />
          
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse shrink-0" />
                
                {/* Content card */}
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                  <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
                  
                  {/* Metadata */}
                  <div className="flex gap-4">
                    <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}