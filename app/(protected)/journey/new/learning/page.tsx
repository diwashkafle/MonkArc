import Link from 'next/link'
import { createLearningJourney } from '@/lib/server-actions/journey-actions'

export default function NewLearningJourneyPage() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/journey/new" className="text-sm text-slate-600 hover:underline">
            ← Back to Journey Type
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📚</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create Learning Journey
              </h1>
              <p className="mt-1 text-slate-600">
                Define what you want to learn and commit to the process
              </p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form action={createLearningJourney} className="rounded-xl bg-white p-8 shadow-sm">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Journey Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Master React in 30 Days"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                A clear, specific title for your learning goal
              </p>
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
                placeholder="Why are you learning this? What do you hope to achieve?"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Your motivation and goals (minimum 10 characters)
              </p>
            </div>
            
            {/* Target Check-ins */}
            <div>
              <label htmlFor="targetCheckIns" className="block text-sm font-medium text-slate-700">
                Target Check-ins{'(Total days for learning)'} *
              </label>
              <input
                type="number"
                id="targetCheckIns"
                name="targetCheckIns"
                required
                min="7"
                max="365"
                defaultValue="30"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                How many check-ins to reach Arc status? (7-365 days)
              </p>
            </div>
            
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                defaultValue={today}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                When do you want to start this journey?
              </p>
            </div>
            
            {/* Core Resource */}
            <div>
              <label htmlFor="coreResource" className="block text-sm font-medium text-slate-700">
                Core Resource (Optional)
              </label>
              <input
                type="url"
                id="coreResource"
                name="coreResource"
                placeholder="https://example.com/course"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Link to your main learning resource (course, book, tutorial, etc.)
              </p>
            </div>
            
            {/* Public/Private */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-700">
                Make this journey public (visible on your profile)
              </label>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Link
              href="/journey/new"
              className="text-sm text-slate-600 hover:underline"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Create Learning Journey
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}