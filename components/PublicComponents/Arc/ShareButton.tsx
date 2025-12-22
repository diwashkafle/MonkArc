'use client'

import { useState } from 'react'
import { Share2, Link as LinkIcon, Check, Twitter, Linkedin } from 'lucide-react'

interface ShareButtonProps {
  arcUrl: string
  title: string
  isPublic: boolean
}

export function ShareButton({ arcUrl, title, isPublic }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://monkarc.com'}${arcUrl}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToTwitter = () => {
    const text = `I just completed my journey: ${title} 🎯\n\nCheck out my Arc on MonkArc!`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!isPublic) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
      >
        <Share2 className="h-4 w-4" />
        <span className="font-medium">Share Arc</span>
      </button>

      {/* Share Menu Dropdown */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-600" />
              ) : (
                <LinkIcon className="h-5 w-5 text-slate-600" />
              )}
              <div className="flex-1">
                <div className="font-medium text-slate-900">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </div>
                <div className="text-xs text-slate-500">
                  Share anywhere
                </div>
              </div>
            </button>

            <div className="border-t border-slate-200" />

            {/* Twitter */}
            <button
              onClick={shareToTwitter}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium text-slate-900">Share on Twitter</div>
                <div className="text-xs text-slate-500">Post to your feed</div>
              </div>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareToLinkedIn}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <Linkedin className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-slate-900">Share on LinkedIn</div>
                <div className="text-xs text-slate-500">Post to your network</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}