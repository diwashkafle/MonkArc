// app/api/github-app/uninstall/route.ts

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getGitHubApp } from '@/lib/github-app/client'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Get user's installation
    const installation = await db.query.githubInstallations.findFirst({
      where: eq(githubInstallations.userId, session.user.id),
    })
    
    if (!installation) {
      return NextResponse.json({ error: 'No installation found' }, { status: 404 })
    }
    
    // Delete installation from GitHub
    try {
      const app = getGitHubApp()
      await app.octokit.request(
        'DELETE /app/installations/{installation_id}',
        {
          installation_id: installation.installationId,
        }
      )
      console.log('✅ Uninstalled from GitHub:', installation.installationId)
    } catch (githubError) {
      console.error('⚠️ Failed to uninstall from GitHub (may already be uninstalled):', githubError)
      // Continue anyway - delete from our DB
    }
    
    // Delete from database
    await db
      .delete(githubInstallations)
      .where(eq(githubInstallations.userId, session.user.id))
    
    console.log('✅ Removed from database for user:', session.user.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Failed to uninstall:', error)
    return NextResponse.json({ error: 'Failed to uninstall' }, { status: 500 })
  }
}