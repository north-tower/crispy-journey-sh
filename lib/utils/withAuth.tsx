// src/utils/withAuth.tsx
import { useEffect } from 'react';
import Router from 'next/router';
import { useAuthStore } from '../store/authStore';

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const { isAuthenticated, loadUser } = useAuthStore();

    useEffect(() => {
      const initAuth = async () => {
        await loadUser();
        if (!isAuthenticated) {
          Router.push('/login');
        }
      };

      initAuth();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
