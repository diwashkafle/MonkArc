export default function JourneyLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
        </div>
      </main>
    </div>
  )
}