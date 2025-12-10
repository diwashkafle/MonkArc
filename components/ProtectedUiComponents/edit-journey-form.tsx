'use client'

import { useState } from 'react'
import Link from 'next/link'
import { editJourney } from '@/lib/server-actions/journey-actions'
import { ResourceManager } from '@/components/ProtectedUiComponents/resource-manager'
import type { Resource } from '@/lib/validation/journey-validation'

interface Journey {
  id: string
  title: string
  description: string
  type: 'learning' | 'project'
  targetCheckIns: number
  startDate: string
  isPublic: boolean
  resources: Resource[] | null
  repoURL: string | null
  techStack: string[] | null
}

interface EditJourneyFormProps {
  journey: Journey
}

export function EditJourneyForm({ journey }: EditJourneyFormProps) {
  const [resources, setResources] = useState<Resource[]>(journey.resources || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append('resources', JSON.stringify(resources))
    
    try {
      await editJourney(journey.id, formData)
      // Redirect happens in action
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      alert(error instanceof Error ? error.message : 'Failed to update journey')
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Journey Type (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Journey Type
        </label>
        <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600">
          {journey.type === 'learning' ? '📚 Learning Journey' : '💻 Project'}
          <span className="ml-2 text-xs">(Cannot be changed)</span>
        </div>
      </div>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Journey Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          minLength={3}
          maxLength={500}
          defaultValue={journey.title}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          defaultValue={journey.description}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>
      
      {/* Target & Start Date (Read-only) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Target Check-ins
          </label>
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600">
            {journey.targetCheckIns} days
            <span className="ml-2 text-xs">(Cannot be changed)</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Start Date
          </label>
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600">
            {new Date(journey.startDate).toLocaleDateString()}
            <span className="ml-2 text-xs">(Cannot be changed)</span>
          </div>
        </div>
      </div>
      
      {/* Learning Resources */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-3">
          Learning Resources
        </label>
        <ResourceManager
          initialResources={resources}
          onChange={setResources}
        />
      </div>
      
      {/* GitHub Repo (for projects) */}
      {journey.type === 'project' && (
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            GitHub Repository <span className="text-slate-400">(Optional)</span>
          </label>
          <input
            type="url"
            name="repoURL"
            defaultValue={journey.repoURL || ''}
            placeholder="https://github.com/username/repo"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-2 text-xs text-slate-500">
            Update your GitHub repository URL
          </p>
        </div>
      )}
      
      {/* Tech Stack (for projects) */}
      {journey.type === 'project' && (
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Tech Stack <span className="text-slate-400">(Optional)</span>
          </label>
          <input
            type="text"
            name="techStack"
            defaultValue={journey.techStack?.join(', ') || ''}
            placeholder="React, TypeScript, Next.js (comma-separated)"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      )}
      
      {/* Privacy */}
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={journey.isPublic}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">
              Make this journey public
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Public journeys appear on your profile and the community feed
            </div>
          </div>
        </label>
      </div>
      
      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Link
          href={`/journey/${journey.id}`}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}