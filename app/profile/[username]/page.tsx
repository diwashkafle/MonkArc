import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users, journeys } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  
  // Find user by username
  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  })
  
  if (!user) {
    console.log('user not found'+user+ ". username from param: "+username)
    notFound()  // ✅ 404 if username doesn't exist
  }
  
  // Optional: Check if viewing your own profile
  const session = await auth()
  const isOwnProfile = session?.user?.id === user.id
  
  // Get user's public journeys (or all if own profile)
  const publicJourneys = await db.query.journeys.findMany({
    where: isOwnProfile 
      ? eq(journeys.userId, user.id)  // Show all journeys if own profile
      : and(
          eq(journeys.userId, user.id),
          eq(journeys.isPublic, true)  // Only public if viewing others
        ),
  })
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {isOwnProfile && (
          <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            This is your profile. Only you can see private journeys.
          </div>
        )}
        
        <div className="mb-4">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        
        {/* Profile Header */}
        <div className="flex items-center gap-6 rounded-xl bg-white p-8 shadow-sm">
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
            <p className="text-slate-600">@{user.username}</p>
          </div>
        </div>
        
        {/* Public Journeys */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isOwnProfile ? 'Your Journeys' : 'Public Arcs'}
          </h2>
          
          {publicJourneys.length === 0 ? (
            <p className="mt-4 text-slate-600">
              {isOwnProfile 
                ? "You haven't created any journeys yet." 
                : "No public journeys yet."}
            </p>
          ) : (
            <div className="mt-4 grid gap-4">
              {publicJourneys.map((journey) => (
                <Link
                  key={journey.id}
                  href={`/journey/${journey.id}`}
                  className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {journey.title}
                    </h3>
                    {!journey.isPublic && (
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {journey.phase === 'arc' ? '🎋 Arc' : '🌱 Seed'} •{' '}
                    {journey.totalCheckIns}/{journey.targetCheckIns} check-ins
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

