import {  signOut } from '@/lib/auth'

const LogoutButton = () => {
  return (
   <form
      action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button
                type="submit"
              >
                Sign Out
              </button>
            </form>
  )
}

export default LogoutButton