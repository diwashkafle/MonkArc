import { db } from '@/db'
import { users, journeys } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { ShareProfileButton } from '@/components/ProtectedUiComponents/journeys/share-profile-button'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params
  
  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  })
  
  if (!user) {
    return {
      title: 'User Not Found',
    }
  }
  
  return {
    title: `${user.name} (@${username}) - MonkArc`,
    description: `Check out ${user.name}'s journey on MonkArc`,
    openGraph: {
      title: `${user.name} (@${username})`,
      description: `Check out ${user.name}'s learning journeys and projects`,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const session = await auth()
  
  // Find user by username
  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  })
  
  if (!user) {
    notFound()
  }
  
  const isOwnProfile = session?.user?.id === user.id
  
  // Get user's public journeys (or all if own profile)
  const userJourneys = await db.query.journeys.findMany({
    where: isOwnProfile 
      ? eq(journeys.userId, user.id)
      : and(
          eq(journeys.userId, user.id),
          eq(journeys.isPublic, true)
        ),
    orderBy: (journeys, { desc }) => [desc(journeys.createdAt)],
  })
  
  // Calculate stats
  const stats = {
    totalJourneys: userJourneys.length,
    arcs: userJourneys.filter(j => j.phase === 'arc').length,
    seeds: userJourneys.filter(j => j.phase === 'seed').length,
    activeJourneys: userJourneys.filter(j => j.status === 'active').length,
    completedJourneys: userJourneys.filter(j => j.status === 'completed').length,
    totalCheckIns: userJourneys.reduce((sum, j) => sum + j.totalCheckIns, 0),
    longestStreak: Math.max(...userJourneys.map(j => j.longestStreak), 0),
  }
  
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${username}`
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            🧘‍♂️ MonkArc
          </Link>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 hover:underline"
                >
                  Dashboard
                </Link>
                {isOwnProfile && (
                  <Link
                    href="/settings"
                    className="text-sm text-slate-600 hover:underline"
                  >
                    Settings
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Profile Header */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full"
                />
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.name}
                </h1>
                <p className="mt-1 text-slate-600">@{user.username}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            {/* Share Button */}
            <ShareProfileButton 
              profileUrl={profileUrl}
              username={user.username || 'user'}
            />
          </div>
          
          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {stats.arcs}
              </div>
              <div className="mt-1 text-sm text-slate-600">Arcs Achieved</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.longestStreak}
              </div>
              <div className="mt-1 text-sm text-slate-600">Longest Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalCheckIns}
              </div>
              <div className="mt-1 text-sm text-slate-600">Total Check-ins</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.activeJourneys}
              </div>
              <div className="mt-1 text-sm text-slate-600">Active Journeys</div>
            </div>
          </div>
        </div>
        
        {/* Journey Type Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💻</span>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.totalJourneys}
                </div>
                <div className="text-sm text-slate-600">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Journeys Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {isOwnProfile ? 'Your Journeys' : 'Public Journeys'}
            </h2>
            {isOwnProfile && (
              <Link
                href="/journey/new"
                className="text-sm text-blue-600 hover:underline"
              >
                + New Journey
              </Link>
            )}
          </div>
          
          {userJourneys.length === 0 ? (
            <div className="mt-6 rounded-lg bg-white p-12 text-center shadow-sm">
              <div className="text-6xl">🌱</div>
              <p className="mt-4 text-slate-600">
                {isOwnProfile 
                  ? "You haven't created any journeys yet." 
                  : "No public journeys yet."}
              </p>
              {isOwnProfile && (
                <Link
                  href="/journey/new"
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Create First Journey
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {userJourneys.map((journey) => (
                <div
                  key={journey.id}
                  className={`rounded-lg bg-white p-6 shadow-sm ${
                    journey.status === 'frozen' ? 'border-2 border-blue-400' : 
                    journey.status === 'dead' ? 'border-2 border-red-400' : 
                    'border border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {journey.status === 'dead' ? '💀' : 
                           journey.status === 'frozen' ? '❄️' : 
                           journey.phase === 'arc' ? '🎋' : '🌱'}
                        </span>
                        <h3 className="font-semibold text-slate-900">
                          {journey.title}
                        </h3>
                      </div>
                      
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {journey.description}
                      </p>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {journey.phase === 'arc' && (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            Arc
                          </span>
                        )}
                        {journey.status === 'frozen' && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            Frozen
                          </span>
                        )}
                        {journey.status === 'dead' && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Dead
                          </span>
                        )}
                        {journey.status === 'completed' && (
                          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                            Completed
                          </span>
                        )}
                        {!journey.isPublic && isOwnProfile && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                            Private
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                        <span>
                         Project
                        </span>
                        <span>•</span>
                        <span>
                          {journey.totalCheckIns}/{journey.targetCheckIns} check-ins
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
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <div className="mt-4 border-t pt-4">
                      <Link
                        href={`/journey/${journey.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}