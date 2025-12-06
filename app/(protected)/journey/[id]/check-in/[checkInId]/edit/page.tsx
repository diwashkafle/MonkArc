import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { db } from '@/db'
import { dailyProgress } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { editCheckIn } from '@/lib/server-actions/check-in-actions'

interface EditCheckInPageProps {
  params: Promise<{
    id: string
    checkInId: string
  }>
}

const JOURNAL_PROMPTS = [
  "What did I learn or build today?",
  "What challenges did I face and how did I overcome them?",
  "What progress did I make toward my goal?",
  "What will I focus on tomorrow?",
  "What insights or realizations did I have?",
]

export default async function EditCheckInPage({ params }: EditCheckInPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
  
  const { id, checkInId } = await params
  
  // Get check-in
  const checkIn = await db.query.dailyProgress.findFirst({
    where: eq(dailyProgress.id, checkInId)
  })
  
  if (!checkIn || checkIn.journeyId !== id) {
    notFound()
  }
  
  // Verify journey ownership
  const journey = await getJourneyById(id, session.user.id)
  if (!journey) notFound()
  
  const checkInDate = new Date(checkIn.date)
  const formattedDate = checkInDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link 
            href={`/journey/${id}/check-in/${checkInId}`} 
            className="text-sm text-slate-600 hover:underline"
          >
            ← Back to Check-In
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Check-In
          </h1>
          <p className="mt-1 text-slate-600">
            {formattedDate}
          </p>
        </div>
        
        {/* Form */}
        <form 
          action={editCheckIn.bind(null, checkInId)}
          className="rounded-xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            {/* Prompt Selection */}
            <div>
              <label htmlFor="promptUsed" className="block text-sm font-medium text-slate-700">
                Reflection Prompt *
              </label>
              <select
                id="promptUsed"
                name="promptUsed"
                required
                defaultValue={checkIn.promptUsed}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
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
                defaultValue={checkIn.journal}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Minimum 50 characters.
              </p>
            </div>
            
            {/* Date info (read-only) */}
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-sm text-slate-700">
                <strong>Date:</strong> {formattedDate}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                The date cannot be changed.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Link
              href={`/journey/${id}/check-in/${checkInId}`}
              className="text-sm text-slate-600 hover:underline"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}