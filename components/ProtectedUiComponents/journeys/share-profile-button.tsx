'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface ShareProfileButtonProps {
  profileUrl: string
  username: string
}

export function ShareProfileButton({ profileUrl, username }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false)
  
  const handleShare = async () => {
    if (navigator.share) {
      // Use native share if available (mobile)
      try {
        await navigator.share({
          title: `${username}'s MonkArc Profile`,
          text: `Check out my journey on MonkArc!`,
          url: profileUrl,
        })
      } catch (error) {
        console.log(error)
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Share Profile
        </>
      )}
    </button>
  )
}