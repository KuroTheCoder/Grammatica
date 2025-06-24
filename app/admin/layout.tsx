// app/admin/layout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FaSpinner } from 'react-icons/fa';
import Sidebar from '@/components/admin/Sidebar';

const useAdminAuth = () => {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingRole, setIsCheckingRole] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // --- THIS IS THE CRITICAL FIX ---
        // If the auth state is still loading, just wait. Don't do anything else.
        if (loading) {
            console.log('Admin Auth: Waiting for Firebase Auth to load...');
            return;
        }

        const checkAdminRole = async () => {
            console.log('Admin Auth: Starting role check. Current user:', user?.email);

            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('Admin Auth: Found user document in Firestore. Data:', userData);
                    const roles = userData.role;
                    console.log('Admin Auth: User roles field:', roles);

                    if (Array.isArray(roles) && roles.includes('admin')) {
                        console.log('%cAdmin Auth: SUCCESS! User is an admin.', 'color: #10B981; font-weight: bold;');
                        setIsAdmin(true);
                    } else {
                        console.error('%cAdmin Auth: FAILED! User is not an admin. Redirecting.', 'color: #F87171; font-weight: bold;');
                        router.replace('/Home');
                    }
                } else {
                    console.error(`%cAdmin Auth: FAILED! No Firestore document found for user ID ${user.uid}. Redirecting.`, 'color: #F87171; font-weight: bold;');
                    router.replace('/Home');
                }
            } else {
                // This now only runs if loading is false AND user is still null.
                console.log("Admin Auth: No user logged in. Redirecting to /Login.");
                router.replace('/Login');
            }
            setIsCheckingRole(false);
        };

        checkAdminRole();
    }, [user, loading, router]); // <-- Notice `loading` is a dependency here

    return { user, isAdmin, isLoading: loading || isCheckingRole };
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoading } = useAdminAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
                <FaSpinner className="animate-spin text-4xl" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}