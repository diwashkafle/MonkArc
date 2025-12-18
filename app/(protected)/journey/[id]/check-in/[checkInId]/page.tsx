/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { db } from '@/db'
import { dailyProgress } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface CheckInDetailPageProps {
  params: Promise<{
    id: string
    checkInId: string
  }>
}

export default async function CheckInDetailPage({ params }: CheckInDetailPageProps) {
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
  
  // Parse GitHub commits if available
  const commits = checkIn.githubCommits as any[] | null
  
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
        <div className="rounded-xl bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">📅</span>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {formattedDate}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    {journey.title}
                  </p>
                </div>
              </div>
            </div>
            
            <Link
              href={`/journey/${id}/check-in/${checkInId}/edit`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
              
          
          {/* Journal Entry */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Journal Entry</h2>
            <div className="mt-3 whitespace-pre-wrap text-slate-700 leading-relaxed">
              {checkIn.accomplishment}
            </div>
          </div>
          
          {/* GitHub Commits */}
          {commits && commits.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-semibold text-slate-900">
                GitHub Activity ({commits.length} {commits.length === 1 ? 'commit' : 'commits'})
              </h2>
              
              <div className="mt-4 space-y-3">
                {commits.map((commit: any) => (
                  <div
                    key={commit.sha}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">💻</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">
                          {commit.message.split('\n')[0]}
                        </div>
                        {commit.message.split('\n').length > 1 && (
                          <div className="mt-1 text-sm text-slate-600">
                            {commit.message.split('\n').slice(1).join('\n')}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                          <span>{commit.author}</span>
                          <span>•</span>
                          <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                          <span>•</span>
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
         
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                No commits detected for this day.
              </p>
            </div>
          
          {/* Metadata */}
          <div className="mt-6 flex items-center gap-6 border-t pt-6 text-sm text-slate-500">
            <div>
              <span className="font-medium">{checkIn.wordCount}</span> words
            </div>
            {checkIn.commitCount > 0 && (
              <div>
                <span className="font-medium">{checkIn.commitCount}</span> GitHub commits
              </div>
            )}
            {checkIn.editedAt && (
              <div>
                Edited on {new Date(checkIn.editedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}