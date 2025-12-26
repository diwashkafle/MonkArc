import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Sprout, Home } from 'lucide-react'

export default async function NotFoundAlt() {
  const session = await auth()
  const redirectPath = session ? '/dashboard' : '/'
  const redirectText = session ? 'Back to Dashboard' : 'Back to Home'

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-xl text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 mb-4">
              <Sprout className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-red-50 border border-red-200">
              <span className="text-2xl font-bold text-red-600">404</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Lost in the Journey
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track!
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href={redirectPath}
              className="block w-full px-6 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                <span>{redirectText}</span>
              </div>
            </Link>
          </div>

          {/* Quick Links for Authenticated Users */}
          {session && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center gap-6 text-sm">
                <Link 
                  href="/journey/new" 
                  className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Create Journey
                </Link>
                <Link 
                  href={`/profile/${session.user.username || 'me'}`}
                  className="text-slate-600 hover:text-slate-900 font-medium hover:underline"
                >
                  My Profile
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Error Code: 404 - Page Not Found
        </p>
      </div>
    </div>
  )
}