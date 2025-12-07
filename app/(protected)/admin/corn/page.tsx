import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CronAdminPage() {
  const session = await auth()
  if (!session) redirect('/login')
  
  // Optional: Add admin check
  // if (session.user.email !== 'your-admin-email@example.com') {
  //   redirect('/dashboard')
  // }
  
  return (
    <div className="min-h-screen bg-slate-50">``
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Cron Job Manager</h1>
        
        <div className="mt-8 space-y-6">
          {/* Manual Trigger */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Manual Status Update
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Manually trigger the journey status update process.
            </p>
            
            <form action="/api/cron/update-journey-statuses" method="POST" className="mt-4">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Run Status Update Now
              </button>
            </form>
          </div>
          
          {/* Cron Schedule Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Automated Schedule
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Status updates run automatically via Vercel Cron.
            </p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">Schedule:</span>
                <code className="rounded bg-slate-100 px-2 py-1">0 0 * * *</code>
                <span className="text-slate-600">(Daily at midnight UTC)</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">Endpoint:</span>
                <code className="rounded bg-slate-100 px-2 py-1">/api/cron/update-journey-statuses</code>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">Status:</span>
                <span className="text-green-600">✓ Configured</span>
              </div>
            </div>
          </div>
          
          {/* What It Does */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              What This Does
            </h2>
            
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Checks all active journeys for missed check-ins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Freezes journeys with 3+ days of inactivity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Marks journeys as dead after 7+ days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Breaks streaks when journeys freeze or die</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Runs automatically every day at midnight UTC</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}