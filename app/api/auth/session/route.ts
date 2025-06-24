// app/api/auth/session/route.ts

// I noticed you didn't have adminAuth imported, so I'm adding it.
// Please make sure the path is correct for your project.
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { idToken } = await request.json();

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        // ----- THE REAL, FINAL, CORRECT FIX IS HERE -----
        // We MUST `await` cookies() to get the actual cookie store before we can `set` on it.
        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, { httpOnly: true, secure: true, maxAge: expiresIn });
        // ----------------------------------------------------

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error("Session creation failed:", error);
        return NextResponse.json({ status: 'error', message: 'Failed to create session' }, { status: 401 });
    }
}