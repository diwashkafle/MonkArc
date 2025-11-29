import { db } from '@/db'
import { users, journeys } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params
  
  // Find user by username
  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  })
  
  if (!user) {
    notFound()
  }
  
  // Get user's public journeys
  const publicJourneys = await db.query.journeys.findMany({
    where: and(
      eq(journeys.userId, user.id),
      eq(journeys.isPublic, true)
    ),
  })
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
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
              width={80}
              height={30}
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
          <h2 className="text-2xl font-bold text-slate-900">Public Arcs</h2>
          
          {publicJourneys.length === 0 ? (
            <p className="mt-4 text-slate-600">No public journeys yet.</p>
          ) : (
            <div className="mt-4 grid gap-4">
              {publicJourneys.map((journey) => (
                <Link
                  key={journey.id}
                  href={`/journey/${journey.id}`}
                  className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900">
                    {journey.title}
                  </h3>
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