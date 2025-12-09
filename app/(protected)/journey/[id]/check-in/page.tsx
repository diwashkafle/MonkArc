import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { hasCheckedInToday } from '@/lib/queries/check-in-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { SimpleCheckInForm } from '@/components/ProtectedUiComponents/check-in-form'

interface NewCheckInPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewCheckInPage({ params }: NewCheckInPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
  
  const { id } = await params
  const journey = await getJourneyById(id, session.user.id)
  
  if (!journey) notFound()
  
  // Check if already checked in today
  const checkedIn = await hasCheckedInToday(id)
  if (checkedIn) {
    redirect(`/journey/${id}`)
  }
  
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Link href={`/journey/${id}`} className="text-sm text-slate-600 hover:underline">
            ← Back to Journey
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Daily Check-in
            </h1>
            <p className="mt-2 text-slate-600">
              {`Take a moment to reflect on today's progress`}
            </p>
          </div>
          
          {/* Form */}
          <SimpleCheckInForm 
            journeyId={id}
            journeyType={journey.type}
            journeyTitle={journey.title}
            date={today}
          />
        </div>
      </main>
    </div>
  )
}