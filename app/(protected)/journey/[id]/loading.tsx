export default function JourneyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-12 space-y-8 animate-pulse">
        
        {/* Header Card */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-8 w-64 bg-slate-200 rounded" />
              <div className="h-4 w-40 bg-slate-200 rounded" />
            </div>
            <div className="h-5 w-5 bg-slate-200 rounded-full" />
          </div>

          <div className="mt-6 h-4 w-full bg-slate-200 rounded" />
          <div className="mt-2 h-4 w-5/6 bg-slate-200 rounded" />

          {/* Tracker */}
          <div className="mt-8 border-t pt-8 space-y-4">
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-3 w-5/6 bg-slate-200 rounded" />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <div className="h-10 w-40 bg-slate-200 rounded-lg" />
            <div className="h-5 w-5 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Resources Section */}
        <div className="rounded-xl bg-white p-8 shadow-sm space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="h-10 w-10 bg-slate-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="rounded-xl bg-white p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 p-6 space-y-4"
            >
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}