'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, GitBranch } from 'lucide-react'

interface LinkGitHubWarningProps {
  userName?: string | null
}

export function LinkGitHubWarning({ userName }: LinkGitHubWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if user has dismissed this banner in this session
  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    // Optionally save to localStorage
    localStorage.setItem('github-warning-dismissed', 'true')
  }

  return (
    <div className="bg-linear-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 mb-6 rounded-lg shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
            <GitBranch className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Link Your GitHub Account
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                Hey{userName ? ` ${userName}` : ''}! Connect your GitHub account to automatically track commits and enhance your journey tracking experience.
              </p>

              {/* Benefits */}
              <ul className="text-xs text-slate-600 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Automatic commit tracking for your check-ins</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Seamless integration with your repositories</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Sign in with either Google or GitHub</span>
                </li>
              </ul>

              {/* Action Button */}
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
              >
                <GitBranch className="h-4 w-4" />
                <span>Link GitHub Account</span>
              </Link>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}