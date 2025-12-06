import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { hasCheckedInToday } from '@/lib/queries/check-in-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createCheckIn } from '@/lib/server-actions/check-in-actions'

interface CheckInPageProps {
  params: Promise<{
    id: string
  }>
}

const JOURNAL_PROMPTS = [
  "What did I learn or build today?",
  "What challenges did I face and how did I overcome them?",
  "What progress did I make toward my goal?",
  "What will I focus on tomorrow?",
  "What insights or realizations did I have?",
]

export default async function CheckInPage({ params }: CheckInPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
  
  const { id } = await params
  const journey = await getJourneyById(id, session.user.id)
  
  if (!journey) notFound()
  
  // Check if already checked in today
  const alreadyCheckedIn = await hasCheckedInToday(id)
  
  if (alreadyCheckedIn) {
    redirect(`/journey/${id}?message=already-checked-in`)
  }
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href={`/journey/${id}`} className="text-sm text-slate-600 hover:underline">
            ← Back to Journey
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {journey.phase === 'arc' ? '🎋' : '🌱'}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Daily Check-In
              </h1>
              <p className="mt-1 text-slate-600">
                {journey.title}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Reminder */}
        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">
                Current Progress
              </div>
              <div className="mt-1 text-2xl font-bold text-blue-600">
                {journey.totalCheckIns} / {journey.targetCheckIns} check-ins
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">
                Current Streak
              </div>
              <div className="mt-1 text-2xl font-bold text-orange-600">
                {journey.currentStreak} 🔥
              </div>
            </div>
          </div>
        </div>
        
        {/* Check-in Form */}
        <form action={createCheckIn} className="rounded-xl bg-white p-8 shadow-sm">
          <input type="hidden" name="journeyId" value={id} />
          <input type="hidden" name="date" value={today} />
          
          <div className="space-y-6">
            {/* Prompt Selection */}
            <div>
              <label htmlFor="promptUsed" className="block text-sm font-medium text-slate-700">
                Choose a reflection prompt *
              </label>
              <select
                id="promptUsed"
                name="promptUsed"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a prompt...</option>
                {JOURNAL_PROMPTS.map((prompt) => (
                  <option key={prompt} value={prompt}>
                    {prompt}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Journal Entry */}
            <div>
              <label htmlFor="journal" className="block text-sm font-medium text-slate-700">
                Journal Entry *
              </label>
              <textarea
                id="journal"
                name="journal"
                required
                rows={12}
                placeholder="Reflect on your progress today. What did you accomplish? What did you learn? What challenges did you face?

Minimum 50 characters required."
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Minimum 50 characters. Be thoughtful and specific.
              </p>
            </div>
            
            {/* Motivation */}
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-900">
                💡 Tip: The best check-ins are honest, specific, and reflective.
              </p>
              <p className="mt-1 text-xs text-emerald-700">
               {` Don't just say "worked on project." Explain what you built, what you learned, and what you'll do next.`}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Link
              href={`/journey/${id}`}
              className="text-sm text-slate-600 hover:underline"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Submit Check-In
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}