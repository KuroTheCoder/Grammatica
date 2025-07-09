// hooks/useClassLeaderboard.ts
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/user'; // Changed to UserProfile

export const useClassLeaderboard = (className: string | undefined) => {
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]); // Changed to UserProfile[]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!className) {
            setLeaderboard([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('class', '==', className),
            orderBy('xp', 'desc'),
            limit(10) // Let's start with top 10
        );

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const fetchedUsers: UserProfile[] = []; // Changed to UserProfile[]
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ uid: doc.id, ...doc.data() } as UserProfile);
                });
                setLeaderboard(fetchedUsers);
                setLoading(false);
            },
            (err) => {
                console.error("Firebase Snapshot Error:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [className]);

    return { leaderboard, loading, error };
};