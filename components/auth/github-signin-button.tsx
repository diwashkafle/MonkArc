'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { FaGithub } from "react-icons/fa";

export default function GithubSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full relative cursor-pointer border border-gray-300 rounded-lg p-2 text-base text-black flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <div className='flex items-center gap-2'>
          <FaGithub/>
          Continue with GitHub
        </div>
      )}
    </button>
  )
}