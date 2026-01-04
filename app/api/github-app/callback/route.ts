
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { githubInstallations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { GitHubRedirectContext } from '@/lib/github/redirect-context'

const COOKIE_NAME = 'github-redirect-source'
const CONTEXT_TIMEOUT = 10 * 60 * 1000 // 10 minutes

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
  
  const { searchParams } = new URL(request.url)
  const installationId = searchParams.get('installation_id')
  
  if (!installationId) {
    return NextResponse.redirect(
      new URL('/settings?error=no-installation-id', request.url)
    )
  }
  
  try {
    // Save/update installation
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
      
      console.log(' Updated installation')
    } else {
      await db.insert(githubInstallations).values({
        userId: session.user.id,
        installationId: parseInt(installationId),
      })
      
      console.log('New installation')
    }
    
    // Read context
    const cookieStore = await cookies()
    const contextCookie = cookieStore.get(COOKIE_NAME)
    
    let redirectUrl = '/settings?github-installed=true'
    let shouldShowCloseMessage = false
    
    if (contextCookie?.value) {
      try {
        const context: GitHubRedirectContext = JSON.parse(
          decodeURIComponent(contextCookie.value)
        )
        
        const age = Date.now() - context.timestamp
        
        if (age < CONTEXT_TIMEOUT) {
          switch (context.source) {
            case 'new-journey':
              //  Show close message ONLY if updating existing (= "Add more repos" in new tab)
              if (existing) {
                shouldShowCloseMessage = true
              }
              redirectUrl = '/journey/new?github-installed=true'
              console.log('📍 new-journey:', existing ? 'close tab' : 'redirect')
              break
            
            case 'edit-journey':
              //  Show close message ONLY if updating existing (= "Add more repos" in new tab)
              if (existing && context.journeyId) {
                shouldShowCloseMessage = true
                redirectUrl = `/journey/${context.journeyId}/edit?github-updated=true`
                console.log('📍 edit-journey:', context.journeyId, 'close tab')
              } else if (context.journeyId) {
                redirectUrl = `/journey/${context.journeyId}/edit?github-updated=true`
                console.log('📍 edit-journey:', context.journeyId, 'redirect')
              }
              break
            
            case 'settings':
              // ALWAYS redirect for settings (never show close message)
              redirectUrl = '/settings?github-installed=true'
              console.log('📍 settings: redirect')
              break
          }
        }
        
        cookieStore.delete(COOKIE_NAME)
      } catch (error) {
        console.error('Failed to parse context:', error)
      }
    }
    
    // Show close message (only for new-journey and edit-journey when updating)
    if (shouldShowCloseMessage) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Repository Updated - MonkArc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f8fafc;
                padding: 1rem;
              }
              
              .container {
                text-align: center;
                padding: 2.5rem 2rem;
                background: white;
                border-radius: 0.75rem;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                max-width: 420px;
                width: 100%;
                border: 1px solid #e2e8f0;
              }
              
              .icon {
                font-size: 3rem;
                margin-bottom: 1rem;
              }
              
              h1 {
                color: #0f172a;
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
              }
              
              p {
                color: #64748b;
                font-size: 0.95rem;
                margin-bottom: 1.5rem;
                line-height: 1.5;
              }
              
              button {
                background: #0f172a;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 0.5rem;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              }
              
              button:hover {
                background: #1e293b;
              }
              
              .countdown {
                margin-top: 1rem;
                color: #94a3b8;
                font-size: 0.875rem;
              }
              
              .countdown-number {
                font-weight: 600;
                color: #475569;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✓</div>
              <h1>Repository Updated</h1>
              <p>You can close this tab and return to MonkArc.</p>
              <button onclick="window.close()">Close Tab</button>
              <p class="countdown">
                Closing in <span class="countdown-number" id="countdown">5</span> seconds
              </p>
            </div>
            
            <script>
              let seconds = 5;
              const countdownEl = document.getElementById('countdown');
              
              const interval = setInterval(() => {
                seconds--;
                countdownEl.textContent = seconds;
                
                if (seconds <= 0) {
                  clearInterval(interval);
                  window.close();
                  
                  setTimeout(() => {
                    document.body.innerHTML = \`
                      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f8fafc; padding: 1rem;">
                        <div style="text-align: center; padding: 2.5rem 2rem; background: white; border-radius: 0.75rem; max-width: 420px; border: 1px solid #e2e8f0;">
                          <div style="font-size: 3rem; margin-bottom: 1rem;">→</div>
                          <h1 style="color: #0f172a; font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Close This Tab</h1>
                          <p style="color: #64748b; font-size: 0.95rem;">Your browser prevented auto-close. Please close manually.</p>
                        </div>
                      </div>
                    \`;
                  }, 1000);
                }
              }, 1000);
            </script>
          </body>
        </html>
        `,
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      )
    }
    
    // Normal redirect (settings, or first-time install)
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('❌ Callback failed:', error)
    
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    
    return NextResponse.redirect(
      new URL('/settings?error=installation-failed', request.url)
    )
  }
}
