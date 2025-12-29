import { NextResponse } from 'next/server'
import { updateAllJourneyStatuses } from '@/lib/journey/journey-status'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) { 
  try {
    // ✅ CRITICAL: Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret) {
      console.error('❌ CRON_SECRET not configured')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    
    const hasValidSecret = authHeader === `Bearer ${cronSecret}`
    
    if (!hasValidSecret) {
      console.log('❌ Unauthorized cron attempt:', {
        ip: request.headers.get('x-forwarded-for'),
        timestamp: new Date().toISOString()
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔄 Starting journey status update cron job...')
    
    const startTime = Date.now()
    const result = await updateAllJourneyStatuses()
    const duration = Date.now() - startTime
    
    console.log('✅ Cron job completed:', {
      duration: `${duration}ms`,
      frozen: result.updated.frozen,
      dead: result.updated.dead,
      timestamp: new Date().toISOString()
    })
    
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

// Support POST for manual testing
export async function POST(request: Request) {
  return GET(request)
}