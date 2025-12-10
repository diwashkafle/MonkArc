import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { EditJourneyForm } from '@/components/ProtectedUiComponents/edit-journey-form'

interface EditJourneyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJourneyPage({ params }: EditJourneyPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
  
  const { id } = await params
  const journey = await getJourneyById(id, session.user.id)
  
  if (!journey) notFound()
  
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
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Journey
          </h1>
          <p className="mt-2 text-slate-600">
            Update your journey details
          </p>
          
          <EditJourneyForm journey={journey} />
        </div>
      </main>
    </div>
  )
}