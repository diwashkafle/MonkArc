"use server"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { accounts } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ========================================
// DISCONNECT GITHUB
// ========================================

export async function disconnectGitHub() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  try {
    // Delete GitHub account connection
    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, session.user.id),
          eq(accounts.provider, 'github')
        )
      )
    
    console.log('✅ GitHub account disconnected')
    
    // Revalidate pages that show GitHub status
    revalidatePath('/settings')
    revalidatePath('/journey/new')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to disconnect GitHub:', error)
    throw new Error('Failed to disconnect GitHub account')
  }
}