// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-slate-200 rounded animate-pulse mt-2" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-8 w-12 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Journeys Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}