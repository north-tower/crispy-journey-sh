import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Retrieve token from cookies
  const token = req.cookies.get("authToken")?.value;
  const currentPath = req.nextUrl.pathname;

  // Skip static files and API routes
  if (
    currentPath.startsWith("/_next/") || // Static files
    currentPath.startsWith("/api/") || // API endpoints
    /\.(.*)$/.test(currentPath) // Other assets like .js, .css, images
  ) {
    return NextResponse.next();
  }

  // Define unprotected routes
  const unprotectedRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot",
    "/auth/reset",
  ];
  if (unprotectedRoutes.some((route) => currentPath.startsWith(route))) {
    return NextResponse.next(); // Allow unprotected routes
  }

  // Redirect unauthenticated users to the login page
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", currentPath); // Keep track of intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Allow authenticated requests to continue
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
};
