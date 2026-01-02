// app/api/github-app/webhook/route.ts

import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify webhook signature (security)
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET
  if (!secret) return true // Skip verification in dev if no secret
  
  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('x-hub-signature-256') || ''
  
  // Verify webhook is from GitHub
  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const data = JSON.parse(payload)
  const event = request.headers.get('x-github-event')
  
  console.log('📡 GitHub webhook received:', event, data.action)
  
  // When user uninstalls from GitHub
  if (event === 'installation' && data.action === 'deleted') {
    const installationId = data.installation.id
    
    try {
      await db
        .delete(githubInstallations)
        .where(eq(githubInstallations.installationId, installationId))
      
      console.log('✅ Installation removed via webhook:', installationId)
    } catch (error) {
      console.error('❌ Failed to remove installation:', error)
    }
  }
  
  // When user adds/removes repos
  if (event === 'installation_repositories') {
    console.log('📦 Repository access changed:', data.action)
    // Could refresh repo list here if needed
  }
  
  return NextResponse.json({ success: true })
}