
'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

export function ToastHandler() {
  const router = useRouter()
  const searchParams = useSearchParams() 
  
  useEffect(() => {
    // Journey created
    if (searchParams.get('created') === 'true') {
      toast.success('Journey created!', { duration: 4000 })
    }
    
    // Journey updated
    if (searchParams.get('updated') === 'true') {
      toast.success('Journey updated successfully!', { duration: 3000 })
    }
    
    // Journey deleted
    if (searchParams.get('deleted') === 'true') {
      toast.success('Journey deleted', { duration: 3000 })
    }
    
    // Check-in created
    if (searchParams.get('checkin') === 'true') {
      toast.success('Check-in done for today', { duration: 4000 })
    }
    
    // Check-in updated
    if (searchParams.get('checkin-updated') === 'true') {
      toast.success('Check-in updated!', { duration: 3000 })
    }
    
    // Settings updated
    if (searchParams.get('username-updated') === 'true') {
      toast.success('Username updated successfully!', { duration: 4000 })
    }
    // GitHub connected
    if (searchParams.get('github-connected') === 'true') {
      toast.success('GitHub connected successfully!', { duration: 4000 })
    }
    
    
    // Generic success
    const success = searchParams.get('success')
    if (success) {
      toast.success(decodeURIComponent(success), { duration: 4000 })
    }
    
    // Error
    const error = searchParams.get('error')
    if (error) {
      toast.error(decodeURIComponent(error), { duration: 5000 })
    }
    
    // ✅ Clean up URL after showing toast
    if (searchParams.toString()) {
      // Remove all params without scrolling
      router.replace(window.location.pathname, { scroll: false })
    }
  }, [searchParams, router])
  
  return null
}