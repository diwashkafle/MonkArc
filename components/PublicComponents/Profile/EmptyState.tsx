import Link from 'next/link'
import { Sprout, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  isOwnProfile: boolean
  userName: string | null
}

export function EmptyState({ isOwnProfile, userName }: EmptyStateProps) {
  if (isOwnProfile) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6">
          <Sprout className="h-10 w-10 text-emerald-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Start Your First Journey
        </h3>
        
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Plant your first seed and begin tracking your learning progress. Build streaks, reach milestones, and achieve your Arc phase.
        </p>
        
        <Link
          href="/journey/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          <Sparkles className="h-5 w-5" />
          <span>Create First Journey</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-sm">
      <div className="text-6xl mb-4">🌱</div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No Public Journeys Yet
      </h3>
      
      <p className="text-slate-600">
        {userName} hasn&apos;t shared any public journeys yet.
      </p>
    </div>
  )
}