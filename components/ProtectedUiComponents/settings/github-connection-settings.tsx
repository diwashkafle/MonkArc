'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { disconnectGitHub } from '@/lib/server-actions/github-action'
interface GitHubConnectionSettingsProps {
  isConnected: boolean
  githubUsername?: string | null
  githubEmail?: string | null
}

export function GitHubConnectionSettings({ 
  isConnected, 
  githubUsername,
  githubEmail 
}: GitHubConnectionSettingsProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await signIn('github', { callbackUrl: '/settings' })
    } catch (error) {
      console.error('Failed to connect GitHub:', error)
      alert('Failed to connect GitHub account')
      setIsConnecting(false)
    }
  }
  
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your GitHub account? You will lose access to private repositories.')) {
      return
    }
    
    setIsDisconnecting(true)
    try {
      await disconnectGitHub()
      // Page will revalidate automatically
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error)
      alert('Failed to disconnect GitHub account')
      setIsDisconnecting(false)
    }
  }
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        {/* GitHub Icon */}
        <div className="rounded-lg bg-slate-900 p-3">
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            GitHub Integration
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Connect your GitHub account to track commits from private repositories
          </p>
          
          {/* Connection Status */}
          <div className="mt-4">
            {isConnected ? (
              <div className="space-y-3">
                {/* Connected Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Connected
                </div>
                
                {/* Account Info */}
                <div className="rounded-lg bg-slate-50 p-4 space-y-2">
                  {githubUsername && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Username</span>
                      <span className="font-medium text-slate-900">@{githubUsername}</span>
                    </div>
                  )}
                  {githubEmail && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Email</span>
                      <span className="font-medium text-slate-900">{githubEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-slate-600">Access</span>
                    <span className="font-medium text-green-700">Private repos ✓</span>
                  </div>
                </div>
                
                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="w-full rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect GitHub'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Not Connected Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  Not Connected
                </div>
                
                {/* Benefits */}
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Why connect GitHub?
                  </p>
                  <ul className="space-y-1.5 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Track commits from private repositories
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Automatic commit counting in check-ins
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      View commit details in journey timeline
                    </li>
                  </ul>
                </div>
                
                {/* Connect Button */}
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {isConnecting ? 'Connecting...' : 'Connect GitHub Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}