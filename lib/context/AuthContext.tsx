'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct hook for Next.js App Router
import { isProtectedRoute } from '../utils/protectedRoutes';
import { useAuthStore } from '../store/authStore';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true); // Explicit loading state

  useEffect(() => {
    const checkAuth = async () => {
      await loadUser(); // Loads the user
      setIsLoading(false); // Stop loading after user data is loaded

      if (!isAuthenticated && isProtectedRoute(router.pathname)) {
        router.push('/auth/login'); // Redirect to login if unauthenticated
      }
    };

    checkAuth();
  }, [isAuthenticated, router, loadUser]);

  if (isLoading) {
    // Show a loading screen while checking authentication
    return <div>Loading...</div>;
  }

  return <>{children}</>; // Render children after loading is complete
};

export default AuthProvider;
