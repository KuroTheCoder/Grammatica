import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Look for the simple 'auth-token'
    const authToken = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/dashboard', '/admin'];

    // If trying to access a protected route WITHOUT a token, redirect to Login
    if (protectedRoutes.some(path => pathname.startsWith(path)) && !authToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/Login';
        return NextResponse.redirect(url);
    }

    // If ALREADY logged in and trying to access Login page, redirect to Home
    if (pathname.startsWith('/Login') && authToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};