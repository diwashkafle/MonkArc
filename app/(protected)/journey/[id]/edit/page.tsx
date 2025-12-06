import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { editJourney } from '@/lib/server-actions/journey-actions';

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
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href={`/journey/${id}`} className="text-sm text-slate-600 hover:underline">
            ← Back to Journey
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Journey
          </h1>
          <p className="mt-1 text-slate-600">
            Update your journey details
          </p>
        </div>
        
        {/* Form */}
        <form 
          action={editJourney.bind(null, id)}
          className="rounded-xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={journey.title}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={journey.description}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Learning-specific fields */}
            {journey.type === 'learning' && (
              <div>
                <label htmlFor="coreResource" className="block text-sm font-medium text-slate-700">
                  Core Resource (Optional)
                </label>
                <input
                  type="url"
                  id="coreResource"
                  name="coreResource"
                  defaultValue={journey.coreResource || ''}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            
            {/* Project-specific fields */}
            {journey.type === 'project' && (
              <>
                <div>
                  <label htmlFor="deliverable" className="block text-sm font-medium text-slate-700">
                    Deliverable *
                  </label>
                  <textarea
                    id="deliverable"
                    name="deliverable"
                    required
                    rows={3}
                    defaultValue={journey.deliverable || ''}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="repoURL" className="block text-sm font-medium text-slate-700">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    id="repoURL"
                    name="repoURL"
                    required
                    defaultValue={journey.repoURL || ''}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="techStack" className="block text-sm font-medium text-slate-700">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    id="techStack"
                    name="techStack"
                    defaultValue={journey.techStack?.join(', ') || ''}
                    placeholder="React, TypeScript, Node.js"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Comma-separated list
                  </p>
                </div>
              </>
            )}
            
            {/* Immutable fields (display only) */}
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-medium text-slate-700">
                These fields cannot be changed:
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Type:</span>{' '}
                  {journey.type === 'learning' ? '📚 Learning' : '💻 Project'}
                </div>
                <div>
                  <span className="font-medium">Target Check-ins:</span>{' '}
                  {journey.targetCheckIns}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span>{' '}
                  {new Date(journey.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Public/Private */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                defaultChecked={journey.isPublic}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-700">
                Make this journey public
              </label>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Link
              href={`/journey/${id}`}
              className="text-sm text-slate-600 hover:underline"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}