// app/admin/layout.tsx
// THIS IS A SERVER COMPONENT!

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import Sidebar from '@/components/admin/Sidebar';

/**
 * Server-side function to check admin authentication.
 */
async function checkAdminAuth() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        console.log("Server Auth: No session cookie found. Redirecting to /Login.");
        redirect('/Login');
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;

        const userDocRef = adminDb.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        // ----- THE FINAL, REAL, ULTIMATE FIX IS HERE -----
        // `exists` is a property, NOT a function, in the Admin SDK.
        if (userDoc.exists && userDoc.data()?.role?.includes('admin')) {
            // ----------------------------------------------------
            console.log(`Server Auth: SUCCESS! User ${uid} is an admin.`);
            return true;
        } else {
            console.error(`Server Auth: FAILED! User ${uid} is not an admin. Redirecting.`);
            redirect('/Home');
        }
    } catch (error) {
        console.error("Server Auth: Error verifying session cookie. Redirecting.", error);
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