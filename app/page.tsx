import Link from 'next/link'
import { getPublicJourneysForFeed, getPublicStats } from '@/lib/queries/journey-queries'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import LandingPage from '@/components/PublicComponents/LandingPage'

export default async function HomePage() {
  const publicJourneys = await getPublicJourneysForFeed(12)
  const stats = await getPublicStats()
  const session = await auth();
  
  return (
    <LandingPage/>
  )
}