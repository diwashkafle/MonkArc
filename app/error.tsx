'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error)
  }, [error])

  // Check if user is authenticated (client-side check)
  const isAuthenticated = typeof window !== 'undefined' && document.cookie.includes('authjs.session-token')
  const redirectPath = isAuthenticated ? '/dashboard' : '/'
  const redirectText = isAuthenticated ? 'Go to Dashboard' : 'Go to Homepage'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8 relative">
          {/* Large Error Icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-50 border-4 border-red-100 mb-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          
          {/* Floating warning elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md">
            <div className="absolute -top-4 left-8 w-12 h-12 bg-red-100 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
            <div className="absolute -top-2 right-12 w-8 h-8 bg-orange-100 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
            <div className="absolute top-8 left-20 w-6 h-6 bg-amber-100 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto mb-6">
           {` We encountered an unexpected error. Don't worry, it's not your fault!`}
          </p>
          
          {/* Error Details (collapsed by default) */}
          <details className="max-w-xl mx-auto text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 mb-2 inline-flex items-center gap-2">
              <span>View technical details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200">
              <p className="text-xs font-mono text-slate-700 break-all">
                {error.message || 'An unknown error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </details>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          <Link
            href={redirectPath}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>{redirectText}</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-xl mx-auto">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Still having issues?
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            If the problem persists, try these steps:
          </p>
          <ul className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Refresh the page or clear your browser cache</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Try again in a few minutes</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        {isAuthenticated && (
          <div className="mt-8 pt-6 border-t border-slate-200 max-w-xl mx-auto">
            <p className="text-sm text-slate-500 mb-4">Or navigate to:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link 
                href="/dashboard" 
                className="text-slate-600 hover:text-slate-900 hover:underline"
              >
                Dashboard
              </Link>
              <span className="text-slate-300">•</span>
              <Link 
                href="/journey/new" 
                className="text-slate-600 hover:text-slate-900 hover:underline"
              >
                New Journey
              </Link>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => window.history.back()}
                className="text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}