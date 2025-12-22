'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface EditCheckInFormProps {
  checkInId: string
  journeyId: string
  journeyTitle: string
  date: string
  initialAccomplishment: string
  initialNotes: string
}

export function EditCheckInForm({ 
  checkInId,
  journeyId,
  journeyTitle,
  date,
  initialAccomplishment,
  initialNotes
}: EditCheckInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accomplishment, setAccomplishment] = useState(initialAccomplishment)
  const [notes, setNotes] = useState(initialNotes)
  const router = useRouter()
  
  const question = 'What did you build today?'
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append('accomplishment', accomplishment)
    formData.append('notes', notes)
    
    try {
      // Call your editCheckIn server action
      const editCheckIn = (await import('@/lib/server-actions/check-in-actions')).editCheckIn
      await editCheckIn(checkInId, formData)
      // Action will redirect automatically
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)

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
        <div className="text-xs text-slate-400 mt-2">
          The date cannot be changed
        </div>
      </div>
      
      {/* Question 1: Accomplishment (Required) */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          {question} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={accomplishment}
          onChange={(e) => setAccomplishment(e.target.value)}
          required
          minLength={10}
          maxLength={500}
          placeholder="Keep it concise - a few words or sentences"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Keep it concise and clear
          </span>
          <span className={`font-medium ${
            accomplishmentLength < 10 
              ? 'text-red-500' 
              : accomplishmentLength > 450 
                ? 'text-orange-500' 
                : 'text-slate-500'
          }`}>
            {accomplishmentLength} / 500
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
          onClick={() => router.push(`/journey/${journeyId}/check-in/${checkInId}`)}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || accomplishmentLength < 10}
          className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className='flex items-center gap-1'>
              <Loader2 className='animate-spin' /> Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}