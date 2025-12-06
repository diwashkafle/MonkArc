import { NextResponse } from 'next/server'
import { updateAllJourneyStatuses } from '@/lib/journey/journey-status'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// This endpoint is called by Vercel Cron or manually
export async function GET(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Check if request is from Vercel Cron or has valid secret
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron')
    const hasValidSecret = cronSecret && authHeader === `Bearer ${cronSecret}`
    
    if (!isVercelCron && !hasValidSecret) {
      console.log('❌ Unauthorized cron attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔄 Starting journey status update cron job...')
    
    const startTime = Date.now()
    const result = await updateAllJourneyStatuses()
    const duration = Date.now() - startTime
    
    console.log(`✅ Cron job completed in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      total: result.total,
      updated: result.updated,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update statuses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}