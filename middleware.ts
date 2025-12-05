import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  donor: [
    '/donor/dashboard',
    '/donor/profile',
    '/donor/alerts',
    '/donor/update',
  ],
  admin: [
    '/admin/dashboard',
    '/admin/donors',
    '/admin/requests',
    '/admin/analytics',
    '/admin/settings',
  ],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/donor/login',
  '/donor/register',
  '/admin/login',
  '/api/auth/login',
  '/api/auth/register',
];

// Auth pages to redirect away from if already logged in
const AUTH_PAGES = [
  '/donor/login',
  '/donor/register',
  '/admin/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Get auth tokens from cookies
  const donorToken = request.cookies.get('donorAuth')?.value;
  const adminToken = request.cookies.get('adminAuth')?.value;
  const isAuthenticated = Boolean(donorToken || adminToken);
  const userRole = adminToken ? 'admin' : donorToken ? 'donor' : null;

  // Check if accessing an auth page while already logged in
  if (isAuthenticated && AUTH_PAGES.includes(pathname)) {
    const redirectUrl = userRole === 'admin' 
      ? '/admin/dashboard' 
      : '/donor/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Check protected donor routes
  if (PROTECTED_ROUTES.donor.some(route => pathname.startsWith(route))) {
    if (!donorToken && !adminToken) {
      // Not authenticated, redirect to login
      const loginUrl = new URL('/donor/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check protected admin routes
  if (PROTECTED_ROUTES.admin.some(route => pathname.startsWith(route))) {
    if (!adminToken) {
      // Not admin, redirect to admin login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add user role to headers for client-side access
  if (userRole) {
    response.headers.set('X-User-Role', userRole);
  }

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
