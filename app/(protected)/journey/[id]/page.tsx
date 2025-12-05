import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

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
  
  return (
    <div className="min-h-screen bg-slate-50 p-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
        
        <div className="mt-8 rounded-xl bg-white p-8 shadow">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {journey.phase === 'arc' ? '🎋' : '🌱'}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {journey.title}
              </h1>
              <p className="text-slate-600">
                {journey.type === 'learning' ? '📚 Learning' : '💻 Project'} Journey
              </p>
            </div>
          </div>
          
          <p className="mt-6 text-slate-700">{journey.description}</p>
          
          <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
            <div>
              <div className="text-sm text-slate-600">Progress</div>
              <div className="mt-1 text-2xl font-bold">
                {journey.totalCheckIns}/{journey.targetCheckIns}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-slate-600">Current Streak</div>
              <div className="mt-1 text-2xl font-bold">
                {journey.currentStreak} 🔥
              </div>
            </div>
            
            <div>
              <div className="text-sm text-slate-600">Status</div>
              <div className="mt-1 text-2xl font-bold capitalize">
                {journey.status}
              </div>
            </div>
          </div>
          
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
        </div>
      </div>
    </div>
  )
}