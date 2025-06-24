// THIS IS A SERVER COMPONENT!

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import Sidebar from '@/components/admin/Sidebar';

/**
 * Server-side function to check admin authentication using an ID Token.
 */
async function checkAdminAuth() {
    // --- THIS IS THE FIX FOR THE TYPESCRIPT ERROR ---
    // We must 'await' the cookies() function to get the cookie store.
    const cookieStore = await cookies();

    // We are now looking for 'auth-token', not 'session'
    const idToken = cookieStore.get('auth-token')?.value;

    if (!idToken) {
        console.log("Server Auth: No auth-token cookie found. Redirecting to /Login.");
        redirect('/Login');
    }

    try {
        // We use verifyIdToken, not verifySessionCookie
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        const uid = decodedClaims.uid;

        // Check for the 'admin' role in the token's claims first for efficiency
        // NOTE: Make sure your custom claims function actually sets a 'role' property.
        if (Array.isArray(decodedClaims.role) && decodedClaims.role.includes('admin')) {
            console.log(`Server Auth SUCCESS: User ${uid} is an admin based on token claims.`);
            return true;
        }

        // As a fallback, check Firestore (good for immediate role changes)
        const userDocRef = adminDb.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists && userDoc.data()?.role?.includes('admin')) {
            console.log(`Server Auth SUCCESS: User ${uid} is an admin based on Firestore.`);
            return true;
        } else {
            console.error(`Server Auth FAILED: User ${uid} is not an admin. Redirecting.`);
            redirect('/Home'); // Send non-admins away
        }
    } catch (error) {
        console.error("Server Auth: Error verifying ID token. Redirecting.", error);
        redirect('/Login');
    }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await checkAdminAuth();

    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}