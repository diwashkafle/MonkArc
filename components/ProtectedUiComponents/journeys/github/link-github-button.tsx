'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { RepoSelector } from './repo-selector'
import { CheckCircle } from 'lucide-react'

interface LinkGitHubButtonProps {
  variant?: 'inline' | 'card'
  isConnected: boolean
  onRepoSelect?: (repoUrl: string) => void
  currentRepo?: string | null
}

export function LinkGitHubButton({ 
  variant = 'inline', 
  isConnected,
  onRepoSelect,
  currentRepo 
}: LinkGitHubButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await signIn('github', { callbackUrl: window.location.href })
    } catch (error) {
      console.error('Failed to connect GitHub:', error)
      setIsConnecting(false)
    }
  }

  // If connected, show repo selector
  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">GitHub Connected</span>
        </div>
        
        {onRepoSelect && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Repository
            </label>
            <RepoSelector 
              onSelect={onRepoSelect}
              selectedRepo={currentRepo}
            />
          </div>
        )}
      </div>
    )
  }
  
  // Not connected - show connect button
  if (variant === 'card') {
    return (
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔐</div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">
              Connect GitHub
            </h4>
            <p className="text-sm text-blue-800 mt-1">
              Link your GitHub account to select repositories and track commits
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="mt-3 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {isConnecting ? 'Connecting...' : 'Connect GitHub'}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Inline variant
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      {isConnecting ? 'Connecting...' : 'Link GitHub'}
    </button>
  )
}