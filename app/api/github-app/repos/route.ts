// app/api/github-app/repos/route.ts

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getInstallationOctokit } from '@/lib/github-app/client'
import { NextResponse } from 'next/server'


export async function GET() {
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
      return NextResponse.json({ error: 'No GitHub App installation found' }, { status: 404 })
    }
    
    // Get Octokit instance for this installation
    const octokit = await getInstallationOctokit(installation.installationId)
    
    // Fetch repositories the installation has access to
    const { data } = await octokit.request('GET /installation/repositories', {
      per_page: 100,
    })
    
    const repos = data.repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      private: repo.private,
      description: repo.description,
      language: repo.language, 
      updatedAt: repo.updated_at,
    }))
    
    return NextResponse.json({ repos })
  } catch (error) {
    console.error('Failed to fetch repos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}