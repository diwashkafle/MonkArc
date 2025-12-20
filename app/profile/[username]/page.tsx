import { db } from '@/db'
import { users, journeys } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { ShareProfileButton } from '@/components/ProtectedUiComponents/journeys/share-profile-button'
import Header from '@/components/ProtectedUiComponents/ProtectedHeader/Header'
import { SiAlwaysdata, SiCodefresh, SiCodeigniter } from "react-icons/si"
import { FaCalendarCheck } from "react-icons/fa"
import { DiCodeigniter } from "react-icons/di"
import { MdSevereCold } from "react-icons/md"
import { GiAzulFlake, GiDeathNote } from 'react-icons/gi'
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5"

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
      <Header session={session}/>
      
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12">
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
          <div className="mt-8 flex flex-wrap justify-between items-center gap-4 border-t pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.arcs}
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                Arcs <GiAzulFlake/>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.longestStreak}
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                Longest Streak <DiCodeigniter/>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.totalCheckIns}
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                Total Check-ins <FaCalendarCheck/>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.activeJourneys}
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                Active Journeys <SiAlwaysdata/>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.completedJourneys}
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                Completed <IoCheckmarkDoneCircleSharp/>
              </div>
            </div>
          </div>
        </div>
        
        {/* Journeys Section */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {isOwnProfile ? 'Your Journeys' : 'Public Journeys'}
            </h2>
            {isOwnProfile && (
              <Link
                href="/journey/new"
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                + New Journey
              </Link>
            )}
          </div>
          
          {userJourneys.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <h4 className="mt-4 text-lg font-semibold text-slate-900">
                {isOwnProfile ? 'No journeys yet' : 'No public journeys yet'}
              </h4>
              <p className="mt-2 text-slate-600">
                {isOwnProfile 
                  ? "Create your first journey to start your MonkArc experience." 
                  : `${user.name} hasn't shared any public journeys yet.`}
              </p>
              {isOwnProfile && (
                <Link
                  href="/journey/new"
                  className="mt-6 inline-block rounded-lg bg-gray-600 px-6 py-3 font-medium text-white hover:bg-gray-700"
                >
                  Create First Journey
                </Link>
              )}
            </div>
          ) : (
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              {userJourneys.map((journey) => {
                const daysSince = daysSinceLastCheckIn(journey.lastCheckInDate)
                
                return (
                  <div
                    key={journey.id}
                    className="rounded-lg bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-slate-900">
                            {journey.title.length > 30 ? journey.title.slice(0,30)+"...":journey.title}
                          </h4>
                          
                          {/* Phase Badge */}
                          {journey.phase === 'seed' && (
                            <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              <span className='text-base'><SiCodefresh/></span> Seed
                            </span>
                          )}
                          {journey.phase === 'arc' && journey.status !== 'dead' && (
                            <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              <span className='text-base'><GiAzulFlake/></span> Arc
                            </span>
                          )}
                          
                          {/* Status Badges */}
                          {journey.status === 'frozen' && (
                            <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              <span className='text-base'><MdSevereCold/></span> Frozen
                            </span>
                          )}
                          {journey.status === 'dead' && (
                            <span className="rounded-full flex items-center gap-1 bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              <span className='text-base'><GiDeathNote/></span> Dead
                            </span>
                          )}
                          {journey.status === 'completed' && (
                            <span className="rounded-full flex items-center gap-1 bg-gray-100 px-3 py-1 font-medium text-gray-700">
                              <IoCheckmarkDoneCircleSharp/> <span className='text-xs py-1'>Completed</span>
                            </span>
                          )}
                          
                          {/* Private Badge (only for own profile) */}
                          {!journey.isPublic && isOwnProfile && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              🔒 Private
                            </span>
                          )}
                        </div>
                        
                        <p className="mt-2 text-sm text-slate-600">
                          {journey.description}
                        </p>
                        
                        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                          <span>
                            {journey.totalCheckIns}/{journey.targetCheckIns} check-ins
                          </span>
                          <span>•</span>
                          <span>
                            {journey.currentStreak > 0 
                              ? (
                                <div className='flex gap-1 items-center'>
                                  <h1>{journey.currentStreak} day streak</h1> 
                                  <span className='text-gray-800'><SiCodeigniter/></span>
                                </div>
                              )
                              : 'No current streak'}
                          </span>
                          {journey.status === 'active' && daysSince > 0 && (
                            <>
                              <span>•</span>
                              <span className={daysSince >= 2 ? 'text-yellow-600 font-medium' : ''}>
                                {daysSince} {daysSince === 1 ? 'day' : 'days'} since last check-in
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Tech Stack */}
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
                      
                      <Link
                        href={`/journey/${journey.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}