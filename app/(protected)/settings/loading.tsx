
export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-40 bg-slate-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="space-y-6">
          
          {/* Profile Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-64 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-slate-200 rounded-full animate-pulse shrink-0" />
              <div className="flex-1 space-y-4">
                <div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-3 w-48 bg-slate-200 rounded animate-pulse mt-2" />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-80 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Google Account */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                  <div>
                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
              </div>

              {/* GitHub Account */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                  <div>
                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-56 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-24 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-72 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-80 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-11 bg-slate-200 rounded-full animate-pulse" />
              </div>

              {/* Weekly Summary Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-72 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-11 bg-slate-200 rounded-full animate-pulse" />
              </div>

              {/* Default Journey Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 w-56 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-64 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-11 bg-slate-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-red-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-200">
              <div>
                <div className="h-6 w-32 bg-red-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-96 bg-red-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex-1">
                  <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-80 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex-1">
                  <div className="h-5 w-36 bg-red-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-96 bg-red-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-36 bg-red-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}