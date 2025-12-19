import Link from 'next/link'
import { getPublicJourneysForFeed, getPublicStats } from '@/lib/queries/journey-queries'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function HomePage() {
  const publicJourneys = await getPublicJourneysForFeed(12)
  const stats = await getPublicStats()
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900">
              🧘‍♂️ MonkArc
            </h1>
            <p className="mt-4 text-xl text-slate-600">
              Transform learning into lasting growth through daily commitment
            </p>
            <p className="mt-2 text-slate-500">
              Track your journey from Seed 🌱 to Arc 🎋
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/auth/sign-in"
                className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="#public-arcs"
                className="rounded-lg border-2 border-slate-300 bg-white px-8 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Explore Arcs
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {stats.totalArcs}
              </div>
              <div className="mt-2 text-sm text-slate-600">Arcs Achieved</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">
                {stats.totalCheckIns}
              </div>
              <div className="mt-2 text-sm text-slate-600">Total Check-ins</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {stats.totalPublicJourneys}
              </div>
              <div className="mt-2 text-sm text-slate-600">Building Journeys</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            How MonkArc Works
          </h2>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-sm">
              <div className="text-5xl">🌱</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                1. Plant a Seed
              </h3>
              <p className="mt-2 text-slate-600">
                Start a learning journey or project. Set your target check-ins and commit to daily progress.
              </p>
            </div>
            
            <div className="rounded-xl bg-white p-8 shadow-sm">
              <div className="text-5xl">📝</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                2. Check In Daily
              </h3>
              <p className="mt-2 text-slate-600">
                Reflect on your progress with journal entries. Build streaks and track GitHub commits for projects.
              </p>
            </div>
            
            <div className="rounded-xl bg-white p-8 shadow-sm">
              <div className="text-5xl">🎋</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                3. Grow into an Arc
              </h3>
              <p className="mt-2 text-slate-600">
                Reach your target and transform your Seed into an Arc. Celebrate your achievement and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Public Arcs Feed */}
      <div id="public-arcs" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Arcs 🎋
            </h2>
            <Link
              href="/auth/sign-in"
              className="text-sm text-blue-600 hover:underline"
            >
              Start your own →
            </Link>
          </div>
          
          {publicJourneys.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="text-6xl">🌱</div>
              <p className="mt-4 text-slate-600">
                No public Arcs yet. Be the first to share your journey!
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicJourneys.map(async (journey) => {
                // Get user info
                const user = await db.query.users.findFirst({
                  where: eq(users.id, journey.userId)
                })
                
                return (
                  <Link
                    key={journey.id}
                    href={`/profile/${user?.username}`}
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">🎋</span>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600">
                            {journey.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            by {user?.name || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {journey.description}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        Project
                      </span>
                      <span>•</span>
                      <span>
                        {journey.totalCheckIns} check-ins
                      </span>
                      <span>•</span>
                      <span>
                        {journey.longestStreak} day streak 🔥
                      </span>
                    </div>
                    
                    {journey.techStack && journey.techStack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {journey.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                        {journey.techStack.length > 3 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            +{journey.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="border-t bg-slate-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to start your journey?
          </h2>
          <p className="mt-4 text-slate-300">
            Transform your goals into consistent daily practice.
          </p>
          
          <Link
            href="/auth/sign-in"
            className="mt-8 inline-block rounded-lg bg-emerald-600 px-8 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}