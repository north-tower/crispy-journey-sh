// src/utils/protectedRoutes.ts
export const isProtectedRoute = (pathname: string): boolean => {
    const publicRoutes = ['/auth/login', '/auth/register'];
    return !publicRoutes.includes(pathname);
  };
  