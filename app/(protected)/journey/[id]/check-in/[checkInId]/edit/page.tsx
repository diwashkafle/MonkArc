import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { db } from '@/db'
import { dailyProgress } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { EditCheckInForm } from '@/components/ProtectedUiComponents/journeys/edit-check-in-form'

interface EditCheckInPageProps {
  params: Promise<{
    id: string
    checkInId: string
  }>
}

export default async function EditCheckInPage({ params }: EditCheckInPageProps) {
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
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Edit Check-in
            </h1>
            <p className="mt-2 text-slate-600">
              Update your progress and reflections
            </p>
          </div>
          
          {/* Form */}
          <EditCheckInForm 
            checkInId={checkInId}
            journeyId={id}
            journeyTitle={journey.title}
            date={checkIn.date}
            initialAccomplishment={checkIn.accomplishment}
            initialNotes={checkIn.notes || ''}
          />
        </div>
      </main>
    </div>
  )
}