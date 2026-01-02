// app/api/github-app/callback/route.ts

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
  
  const { searchParams } = new URL(request.url)
  const installationId = searchParams.get('installation_id')
  
  if (!installationId) {
    return NextResponse.redirect(
      new URL('/journey/new?error=no-installation-id', request.url)
    )
  }
  
  try {
    const existing = await db.query.githubInstallations.findFirst({
      where: eq(githubInstallations.userId, session.user.id),
    })
    
    if (existing) {
      await db
        .update(githubInstallations)
        .set({
          installationId: parseInt(installationId),
          updatedAt: new Date(),
        })
        .where(eq(githubInstallations.userId, session.user.id))
    } else {
      await db.insert(githubInstallations).values({
        userId: session.user.id,
        installationId: parseInt(installationId),
      })
    }
    
    console.log('✅ GitHub App installation saved')
    
    // ✅ Always redirect to journey/new after installation
    return NextResponse.redirect(
      new URL('/journey/new?github-installed=true', request.url)
    )
  } catch (error) {
    console.error('❌ Failed to save installation:', error)
    return NextResponse.redirect(
      new URL('/journey/new?error=installation-failed', request.url)
    )
  }
}