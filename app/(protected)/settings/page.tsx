import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  async function updateUsername(formData: FormData) {
    'use server'
    
    const session = await auth()
    if (!session) throw new Error('Unauthorized')
    
    const newUsername = formData.get('username') as string
    
    // Validate format
    if (!/^[a-z0-9_-]{3,30}$/.test(newUsername)) {
      throw new Error('Invalid username format')
    }
    
    // Check if taken
    const existing = await db.query.users.findFirst({
      where: eq(users.username, newUsername)
    })
    
    if (existing && existing.id !== session.user.id) {
      throw new Error('Username already taken')
    }
    
    // Update
    await db.update(users)
      .set({ username: newUsername })
      .where(eq(users.id, session.user.id))
    
    revalidatePath('/settings')
    revalidatePath(`/profile/${newUsername}`)
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Profile</h2>
          
          <form action={updateUsername} className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={session.user.username || ''}
              pattern="^[a-z0-9_-]{3,30}$"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="johndoe"
            />
            <p className="mt-1 text-sm text-slate-500">
              3-30 characters, lowercase, numbers, hyphens, underscores only
            </p>
            
            <button
              type="submit"
              className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Save
            </button>
          </form>
          
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Your profile URL:</p>
            <Link
              href={`/profile/${session.user.username}`}
              className="mt-1 block font-medium text-blue-600 hover:underline"
            >
              monkarc.com/profile/{session.user.username}
            </Link>
          </div>
        </div>
        
        <div className="mt-4">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}