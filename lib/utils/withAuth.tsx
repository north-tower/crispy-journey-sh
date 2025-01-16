// src/utils/withAuth.tsx
import { useEffect } from 'react';
import Router from 'next/router';
import { useAuthStore } from '../store/authStore';

const withAuth = (WrappedComponent: React.FC) => {
  const ComponentWithAuth = (props) => {
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

  // Assign a displayName for easier debugging
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
