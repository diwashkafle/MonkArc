import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteJourneyButton } from '@/components/ProtectedUiComponents/delete-journey-button';
import { pauseJourney, resumeJourney, completeJourney } from '@/lib/server-actions/journey-actions';

interface JourneyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JourneyDetailPage({ params }: JourneyDetailPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
  
  const { id } = await params
  const journey = await getJourneyById(id, session.user.id)
  
  if (!journey) notFound()
  
  const progressPercentage = (journey.totalCheckIns / journey.targetCheckIns) * 100
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Journey Header */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl">
                {journey.phase === 'arc' ? '🎋' : '🌱'}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {journey.title}
                </h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                  <span>
                    {journey.type === 'learning' ? '📚 Learning' : '💻 Project'} Journey
                  </span>
                  <span>•</span>
                  <span className="capitalize font-medium">
                    {journey.status}
                  </span>
                  {!journey.isPublic && (
                    <>
                      <span>•</span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-xs">
                        Private
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-slate-700">{journey.description}</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium text-slate-900">
                {journey.totalCheckIns} / {journey.targetCheckIns} check-ins
              </span>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
            <div>
              <div className="text-sm text-slate-600">Current Streak</div>
              <div className="mt-1 text-2xl font-bold text-orange-600">
                {journey.currentStreak} 🔥
              </div>
            </div>
            
            <div>
              <div className="text-sm text-slate-600">Longest Streak</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {journey.longestStreak}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-slate-600">Phase</div>
              <div className="mt-1 text-2xl font-bold text-emerald-600">
                {journey.phase === 'arc' ? 'Arc 🎋' : 'Seed 🌱'}
              </div>
            </div>
          </div>
          
          {/* Type-specific info */}
          {journey.type === 'project' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-slate-900">Deliverable:</h3>
              <p className="mt-2 text-slate-700">{journey.deliverable}</p>
              
              {journey.repoURL && (
                <a
                  href={journey.repoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View on GitHub →
                </a>
              )}
              
              {journey.techStack && journey.techStack.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-slate-600">Tech Stack:</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {journey.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {journey.type === 'learning' && journey.coreResource && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-slate-900">Core Resource:</h3>
              <a
                href={journey.coreResource}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                {journey.coreResource}
              </a>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
            <Link
              href={`/journey/${id}/edit`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit Journey
            </Link>
            
            {journey.status === 'active' && (
              <form action={pauseJourney.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Pause Journey
                </button>
              </form>
            )}
            
            {journey.status === 'paused' && (
              <form action={resumeJourney.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Resume Journey
                </button>
              </form>
            )}
            
            {journey.phase === 'arc' && journey.status === 'active' && (
              <form action={completeJourney.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Mark Complete 🎉
                </button>
              </form>
            )}
            
            <div className="ml-auto">
              <DeleteJourneyButton journeyId={id} journeyTitle={journey.title} />
            </div>
          </div>
        </div>
        
        {/* Check-ins Section (placeholder) */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Check-ins</h2>
          <p className="mt-4 text-center text-slate-600">
            No check-ins yet. Check-in system coming in Phase 3!
          </p>
        </div>
      </main>
    </div>
  )
}