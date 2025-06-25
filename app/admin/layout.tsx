// File: app/admin/layout.tsx (FINAL CLEAN VERSION)

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// FIXED: Removed the unused 'adminDb' import
import { adminAuth } from '@/lib/firebase-admin';
import Sidebar from '@/components/admin/Sidebar';

async function checkAdminAuth() {
    const cookieStore = await cookies();
    const idToken = cookieStore.get('auth-token')?.value;

    if (!idToken) {
        console.log("Admin Auth: No auth-token cookie found. Redirecting to /Login.");
        redirect('/Login');
    }

    try {
        const decodedClaims = await adminAuth.verifyIdToken(idToken);

        if (decodedClaims.role?.includes('admin')) {
            console.log(`Admin Auth SUCCESS: User ${decodedClaims.uid} is an admin.`);
            return true;
        }

        console.error(`Admin Auth FAILED: User ${decodedClaims.uid} is not an admin. Redirecting.`);
        redirect('/Home');

    } catch (error) {
        console.error("Admin Auth: Error verifying ID token. Redirecting.", error);
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