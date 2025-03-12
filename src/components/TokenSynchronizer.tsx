'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { setToken } from '@/utils/api'

/**
 * This component synchronizes the token from the NextAuth session to localStorage
 * It should be included in the app layout to ensure the token is always available for API calls
 */
const TokenSynchronizer = () => {
  const { data: session } = useSession()

  useEffect(() => {
    // When session changes, update the token in localStorage
    if (session?.user?.token) {
      console.log('TokenSynchronizer: Synchronizing token from session to localStorage')
      setToken(session.user.token)
    }
  }, [session])

  // This is a utility component that doesn't render anything
  return null
}

export default TokenSynchronizer
