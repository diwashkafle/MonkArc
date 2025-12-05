import Link from 'next/link'
import { createProjectJourney } from '@/lib/server-actions/journey-actions'

export default function NewProjectJourneyPage() {
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
            <span className="text-4xl">💻</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create Project Journey
              </h1>
              <p className="mt-1 text-slate-600">
                Build something real and track your development progress
              </p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form action={createProjectJourney} className="rounded-xl bg-white p-8 shadow-sm">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Build a Chess Engine"
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
                placeholder="What is this project? Why are you building it?"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Deliverable */}
            <div>
              <label htmlFor="deliverable" className="block text-sm font-medium text-slate-700">
                Deliverable *
              </label>
              <textarea
                id="deliverable"
                name="deliverable"
                required
                rows={3}
                placeholder="What will you have built by the end? Be specific."
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                The concrete outcome of this project
              </p>
            </div>
            
            {/* Target Check-ins */}
            <div>
              <label htmlFor="targetCheckIns" className="block text-sm font-medium text-slate-700">
                Target Check-ins *
              </label>
              <input
                type="number"
                id="targetCheckIns"
                name="targetCheckIns"
                required
                min="7"
                max="365"
                defaultValue="40"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                How many days to complete? (7-365)
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
            </div>
            
            {/* GitHub Repo */}
            <div>
              <label htmlFor="repoURL" className="block text-sm font-medium text-slate-700">
                GitHub Repository URL *
              </label>
              <input
                type="url"
                id="repoURL"
                name="repoURL"
                required
                placeholder="https://github.com/username/repo"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                {"We'll track your commits automatically"}
              </p>
            </div>
            
            {/* Tech Stack */}
            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-slate-700">
                Tech Stack (Optional)
              </label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Comma-separated list of technologies
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
                Make this project public (visible on your profile)
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
              className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700"
            >
              Create Project Journey
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}