
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUsername(formData: FormData) {
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
try {
    await db.update(users)
    .set({ username: newUsername })
    .where(eq(users.id, session.user.id))
  
  revalidatePath('/settings')
  revalidatePath(`/profile/${newUsername}`)
} catch (error) {
     if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    throw error 
}
}
  redirect('/settings?username-updated=true')
}