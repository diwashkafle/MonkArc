'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckIn } from '@/lib/server-actions/check-in-actions';
import { Loader2 } from 'lucide-react';

interface SimpleCheckInFormProps {
  journeyId: string
  journeyTitle: string
  date: string
}

export function SimpleCheckInForm({ 
  journeyId, 
  journeyTitle,
  date 
}: SimpleCheckInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accomplishment, setAccomplishment] = useState('')
  const [notes, setNotes] = useState('')
  const router = useRouter()
  
  const question = 'What did you build today?'
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append('journeyId', journeyId)
    formData.append('date', date)
    formData.append('accomplishment', accomplishment)
    formData.append('notes', notes)
    
    try {
      await createCheckIn(formData)
      // Action will redirect automatically
    } catch (error) {
      const msg =
    error instanceof Error ? error.message : String(error)

  if (msg.includes("NEXT_REDIRECT")) {
    throw error
  }

  alert(msg)
  setIsSubmitting(false)
    }
  }
  
  const accomplishmentLength = accomplishment.length
  const notesLength = notes.length
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Journey Info */}
      <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
        <div className="font-semibold text-slate-900 mt-1">
          {journeyTitle}
        </div>
        <div className="text-sm text-slate-500 mt-1">
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
      
      {/* Question 1: Accomplishment (Required) */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          {question} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={accomplishment}
          onChange={(e) => setAccomplishment(e.target.value)}
          required
          rows={1}
          minLength={10}
          maxLength={100}
          placeholder="Keep it concise - a few words or sentences"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Keep it concise and clear
          </span>
          <span className={`font-medium ${
            accomplishmentLength < 10 
              ? 'text-red-500' 
              : accomplishmentLength > 100 
                ? 'text-orange-500' 
                : 'text-slate-500'
          }`}>
            {accomplishmentLength} / 100
          </span>
        </div>
      </div>
      
      {/* Question 2: Notes (Optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Share your progress in detail <span className="text-slate-400">(Optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          rows={6}
          placeholder="Add any additional details, challenges faced, or reflections..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Optional - Add context, challenges, or next steps
          </span>
          <span className={`font-medium ${
            notesLength > 1800 ? 'text-orange-500' : 'text-slate-500'
          }`}>
            {notesLength} / 2000
          </span>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || accomplishmentLength < 10}
          className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <span className='flex items-center gap-1'> <Loader2 className='animate-spin' /> Saving...</span>: 'Complete Check-in'}
        </button>
      </div>
    </form>
  )
}