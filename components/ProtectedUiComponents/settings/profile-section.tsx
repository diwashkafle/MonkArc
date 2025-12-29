
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { updateUsername } from '@/lib/server-actions/settings-action'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ProfileSectionProps {
  currentUsername: string
  userId: string
}

export function ProfileSection({ currentUsername, userId }: ProfileSectionProps) {
  const [username, setUsername] = useState(currentUsername)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateUsername(formData)
        toast.success('Username updated successfully!')
        router.refresh()
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
        toast.error(error instanceof Error ? error.message : 'Failed to update username')
      }
    })
  }
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Profile
      </h2>
      
      <form action={handleSubmit}>
        <input type="hidden" name="userId" value={userId} />
        
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          pattern="^[a-z0-9_-]{3,30}$"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          placeholder="johndoe"
        />
        <p className="mt-2 text-xs text-slate-500">
          3-30 characters, lowercase letters, numbers, hyphens, and underscores only
        </p>
        
        {/* Profile URL Preview */}
        {username && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-600 mb-1">Your profile URL:</p>
            <Link
              href={`/profile/${username}`}
              className="text-sm font-medium text-blue-600 hover:underline break-all"
            >
              monkarc.com/profile/{username}
            </Link>
          </div>
        )}
        
        <Button
          variant="outline"
          type="submit"
          disabled={isPending}
          className="mt-4"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Username'
          )}
        </Button>
      </form>
    </div>
  )
}