
'use client'

import { Lock, Globe, ExternalLink } from 'lucide-react'

interface RepoDisplayProps {
  repoURL: string
}

export function RepoDisplay({ repoURL }: RepoDisplayProps) {
  // Extract repo name from URL
  const repoName = repoURL.replace('https://github.com/', '').replace('.git', '')
  
  // Simple check if private (you could make this smarter)
  const isPrivate = false // You'd need to check this from your DB
  
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        {isPrivate ? (
          <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <Globe className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600 truncate flex items-center gap-1"
            >
              {repoName}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Commits are being tracked from this repository
          </p>
        </div>
      </div>
    </div>
  )
}
