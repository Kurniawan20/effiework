// React Imports
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

// Utils Import
import { clearToken, getToken, setToken } from '@/utils/api';

/**
 * Custom hook to handle authentication state
 * This hook synchronizes the NextAuth session with our token storage
 */
export const useAuth = () => {
  const { data: session, status } = useSession();
  
  // Setup token when session changes
  useEffect(() => {
    // If we have a session with a token, save it
    if (session?.user?.token) {
      setToken(session.user.token);
    } 
    // If session is explicitly null (user signed out), clear token
    else if (status === 'unauthenticated') {
      clearToken();
    }
  }, [session, status]);

  /**
   * Sign out the user and clear the token
   */
  const handleSignOut = async () => {
    clearToken();
    await signOut({ callbackUrl: '/login' });
  };

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    signOut: handleSignOut
  };
};

export default useAuth;
