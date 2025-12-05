import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const userRole = request.cookies.get('user_role')?.value;

  // 1. Admin Routes Protection
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin/login') {
      // If already logged in as admin, redirect to dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Protect other admin routes
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Donor Routes Protection
  if (path.startsWith('/donor')) {
    // Allow access to public donor pages (login, register)
    if (['/donor/login', '/donor/register'].includes(path)) {
      // If already logged in as donor, redirect to dashboard
      if (userRole === 'donor' && path === '/donor/login') {
        return NextResponse.redirect(new URL('/donor/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Protect other donor routes
    if (userRole !== 'donor') {
      return NextResponse.redirect(new URL('/donor/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/donor/:path*',
  ],
};
