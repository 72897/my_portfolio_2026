import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Sends signed-out visitors of /admin pages to the login page before anything
// renders. API routes do not rely on this: each one checks the session itself.
export const proxy = auth((req) => {
  if (req.auth?.user) return NextResponse.next();

  const loginUrl = new URL('/admin/login', req.nextUrl.origin);
  loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  // "/admin" itself and everything under it except the login page.
  matcher: ['/admin', '/admin/((?!login).*)'],
};
