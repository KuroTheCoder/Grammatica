"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    query,
    // My bad, bro! We need `onSnapshot` for the real-time witchcraft.
    onSnapshot,
    orderBy,
    where,
    // getDocs is no longer needed for the live feed!
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';
import type { UserData, SortConfig, SortableKeys } from '@/types/user';

// Helper functions are fine here
const getGradeFromClassName = (className: string): string => {
    // ... same as before
    if (!className) return 'default';
    const upperClassName = className.toUpperCase();
    if (upperClassName.startsWith('10') || upperClassName.includes('A')) return '10';
    if (upperClassName.startsWith('11') || upperClassName.includes('B')) return '11';
    if (upperClassName.startsWith('12') || upperClassName.includes('C')) return '12';
    return 'default';
};

// We don't need pagination for a live feed, it gets too complex.
// We'll fetch all matching users and handle filtering/sorting on the client.
// This is perfect for 450 students.
export const useUserManagement = () => {
    const [allUsers, setAllUsers] = useState<UserData[]>([]); // This will hold the LIVE data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Filters are still key
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'displayName', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    // This is the core of the fix. We use onSnapshot for a LIVE feed.
    useEffect(() => {
        setLoading(true);

        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy(sortConfig.key, sortConfig.direction));

        // Setting up the real-time listener
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const fetchedUsers: UserData[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ uid: doc.id, ...doc.data() } as UserData);
                });
                setAllUsers(fetchedUsers);
                setLoading(false);
            },
            (err) => {
                console.error("Firebase Snapshot Error:", err);
                setError(err);
                setLoading(false);
            }
        );

        // Cleanup on unmount
        return () => unsubscribe();
    }, [sortConfig]); // Re-subscribe ONLY when the sorting changes.

    // All filtering and processing now happens on the client side using the live data.
    const processedUsers = useMemo(() => {
        let filtered = [...allUsers];

        if (selectedRole) {
            filtered = filtered.filter(u => u.role?.includes(selectedRole));
        }
        if (selectedGrade) {
            filtered = filtered.filter(u => getGradeFromClassName(u.class || '') === selectedGrade);
        }
        if (selectedClass) {
            filtered = filtered.filter(u => u.class === selectedClass);
        }
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.displayName?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [allUsers, selectedRole, selectedGrade, selectedClass, debouncedSearchTerm]);

    // Derive filter options from the live user data
    const { availableClasses, availableGrades, groupedClasses } = useMemo(() => {
        const classSet = new Set<string>();
        allUsers.forEach(doc => doc.class && classSet.add(doc.class));
        const classes = Array.from(classSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        const gradeSet = new Set<string>();
        classes.forEach(c => {
            const gradeKey = getGradeFromClassName(c);
            if (gradeKey !== 'default') gradeSet.add(gradeKey);
        });
        const grades = Array.from(gradeSet).sort();

        const groups: { [key: string]: string[] } = {};
        grades.forEach(grade => {
            groups[`Grade ${grade}`] = classes.filter(c => getGradeFromClassName(c) === grade);
        });

        return { availableClasses: classes, availableGrades: grades, groupedClasses: groups };
    }, [allUsers]);

    const requestSort = (key: SortableKeys) => {
        setSortConfig(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
    };

    // We no longer export pagination or setUsers! The hook handles everything.
    return {
        loading, error, sortConfig, searchTerm,
        selectedRole, selectedGrade, selectedClass, availableClasses,
        availableGrades, groupedClasses, processedUsers,
        setSearchTerm, setSelectedRole, setSelectedGrade, setSelectedClass, requestSort
    };
};