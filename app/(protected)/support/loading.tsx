
export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-96 bg-slate-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-6 w-[600px] bg-slate-200 rounded animate-pulse mx-auto" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-slate-200 p-6"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse mb-4" />
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* FAQ Skeleton */}
        <div className="rounded-xl bg-white border border-slate-200 p-8">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-6" />
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}