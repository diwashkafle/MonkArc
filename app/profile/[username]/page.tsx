import { db } from '@/db'
import { users, journeys } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import Header from '@/components/ProtectedUiComponents/ProtectedHeader/Header'
import PublicHeader from '@/components/PublicComponents/PublicHeader'
import { ProfileHeader } from '@/components/PublicComponents/Profile/ProfileHeader'
import { JourneysSection } from '@/components/PublicComponents/Profile/JourneySection'
import { EmptyState } from '@/components/PublicComponents/Profile/EmptyState'

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
  
  // Helper function to calculate days since last check-in
  const daysSinceLastCheckIn = (lastCheckInDate: string | null) => {
    if (!lastCheckInDate) return 0
    const last = new Date(lastCheckInDate)
    const today = new Date()
    last.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  // Calculate stats
  const stats = {
    totalSeeds: userJourneys.filter(j => j.phase === 'seed').length, 
    totalArcs: userJourneys.filter(j => j.phase === 'arc').length,
    activeJourneys: userJourneys.filter(j => 
      j.status === 'active' || j.status === 'frozen' || j.status === 'extended'
    ).length,
    completedJourneys: userJourneys.filter(j => j.status === 'completed').length,
    totalCheckIns: userJourneys.reduce((sum, j) => sum + j.totalCheckIns, 0),
    longestStreak: Math.max(...userJourneys.map(j => j.longestStreak), 0),
  }
  
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile/${username}`
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {session?.user.id ? <Header session={session} /> : <PublicHeader />}
      
      {/* Main Content */}
      <main className={session?.user.id ? "mx-auto max-w-7xl pt-12" : "mx-auto max-w-7xl pt-22 sm:pt-25"}>
        {/* Profile Header with Stats */} 
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <ProfileHeader 
              user={user} 
              stats={stats} 
              isOwnProfile={isOwnProfile}
              profileUrl={profileUrl}
            />
          </div>
          
          {/* Share Button (Desktop) */}
          
        </div>
        
        {/* Journeys Section */}
        {userJourneys.length === 0 ? (
          <EmptyState 
            isOwnProfile={isOwnProfile} 
            userName={user.name}
          />
        ) : (
          <JourneysSection 
            journeys={userJourneys}
            isOwnProfile={isOwnProfile}
            daysSinceLastCheckIn={daysSinceLastCheckIn}
          />
        )}
      </main>
    </div>
  )
}