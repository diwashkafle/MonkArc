
'use client'

import { useState } from 'react'

interface PreferencesSectionProps {
  userId: string
}

export function PreferencesSection({ userId }: PreferencesSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Preferences
      </h2>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">
              Email notifications
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Receive emails about your journey progress and milestones
            </div>
          </div>
        </label>
        
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={publicProfile}
            onChange={(e) => setPublicProfile(e.target.checked)}
            disabled
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">
              Public profile
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Allow others to view your profile and public journeys
            </div>
          </div>
        </label>
      </div>
      
      <p className="mt-4 text-xs text-slate-500">
        💡 More preference options coming soon!
      </p>
    </div>
  )
}