// hooks/useUserManagement.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    limit,
    startAfter,
    endBefore,
    limitToLast,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';
// ===== EPIC FIX: Import from our new central types file! =====
import type { UserData, SortConfig, SortableKeys } from '@/types/user';
// =============================================================

// Helper function can stay here as it's specific to this hook's logic
const getGradeFromClassName = (className: string): string => {
    if (!className) return 'default';
    const upperClassName = className.toUpperCase();
    if (upperClassName.startsWith('10') || upperClassName.includes('A')) return '10';
    if (upperClassName.startsWith('11') || upperClassName.includes('B')) return '11';
    if (upperClassName.startsWith('12') || upperClassName.includes('C')) return '12';
    return 'default';
};

const USERS_PER_PAGE = 25;

export const useUserManagement = () => {
    // ... (the rest of the hook code remains exactly the same) ...
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Pagination State
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const [page, setPage] = useState(1);

    // Sorting and Filtering State
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'displayName', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    // Filter Options State
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);
    const [availableGrades, setAvailableGrades] = useState<string[]>([]);
    const [groupedClasses, setGroupedClasses] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const q = query(collection(db, 'users'));
                const userSnapshot = await getDocs(q);
                const classSet = new Set<string>();
                userSnapshot.docs.forEach(doc => doc.data().class && classSet.add(doc.data().class));

                const classes = Array.from(classSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                setAvailableClasses(classes);

                const gradeSet = new Set<string>();
                classes.forEach(c => {
                    const gradeKey = getGradeFromClassName(c);
                    if (gradeKey !== 'default') gradeSet.add(gradeKey);
                });

                const grades = Array.from(gradeSet).sort();
                setAvailableGrades(grades);

                const groups: { [key: string]: string[] } = {};
                grades.forEach(grade => {
                    groups[`Grade ${grade}`] = classes.filter(c => getGradeFromClassName(c) === grade);
                });
                setGroupedClasses(groups);
            } catch (err) {
                console.error("Failed to fetch filter options:", err);
            }
        };
        void fetchFilterOptions();
    }, []);

    const fetchUsers = useCallback(async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        setLoading(true);
        setError(null);
        try {
            let q = query(collection(db, 'users'));

            if (selectedClass) {
                q = query(q, where('class', '==', selectedClass));
            } else if (selectedGrade) {
                const classesInGrade = availableClasses.filter(c => getGradeFromClassName(c) === selectedGrade);
                if (classesInGrade.length > 0) {
                    q = query(q, where('class', 'in', classesInGrade));
                } else {
                    setUsers([]);
                    setLoading(false);
                    return;
                }
            }
            if (selectedRole) {
                q = query(q, where('role', 'array-contains', selectedRole));
            }

            q = query(q, orderBy(sortConfig.key, sortConfig.direction));

            if (direction === 'next' && lastDoc) {
                q = query(q, startAfter(lastDoc));
            } else if (direction === 'prev' && firstDoc) {
                q = query(q, endBefore(firstDoc), limitToLast(USERS_PER_PAGE));
            }

            q = query(q, limit(USERS_PER_PAGE));
            const documentSnapshots = await getDocs(q);
            let fetchedUsers = documentSnapshots.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));

            if (direction === 'prev') {
                fetchedUsers = fetchedUsers.reverse();
            }

            setUsers(fetchedUsers);
            if (documentSnapshots.docs.length > 0) {
                setFirstDoc(documentSnapshots.docs[0]);
                setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            } else if (direction !== 'prev' && direction !== 'next') {
                setFirstDoc(null);
                setLastDoc(null);
            }
            setIsLastPage(documentSnapshots.docs.length < USERS_PER_PAGE);

        } catch (err: unknown) {
            console.error("Firebase Query Error:", err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred.'));
        } finally {
            setLoading(false);
        }
    }, [sortConfig, selectedRole, selectedClass, selectedGrade, availableClasses, firstDoc, lastDoc]);

    useEffect(() => {
        setPage(1);
        setLastDoc(null);
        setFirstDoc(null);
        setIsLastPage(false);
        void fetchUsers('initial');
    }, [sortConfig, selectedRole, selectedClass, selectedGrade, fetchUsers]);

    const goToNextPage = () => { if (!isLastPage) { setPage(p => p + 1); void fetchUsers('next'); } };
    const goToPrevPage = () => { if (page > 1) { setPage(p => p - 1); void fetchUsers('prev'); } };

    const processedUsers = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase();
        if (!term) return users;
        return users.filter(user => (user.displayName || '').toLowerCase().includes(term) || (user.email || '').toLowerCase().includes(term));
    }, [users, debouncedSearchTerm]);

    const requestSort = (key: SortableKeys) => {
        setSortConfig(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
    };

    return {
        users, loading, error, page, isLastPage, sortConfig, searchTerm,
        selectedRole, selectedGrade, selectedClass, availableClasses,
        availableGrades, groupedClasses, processedUsers, setUsers,
        setSearchTerm, setSelectedRole, setSelectedGrade, setSelectedClass,
        goToNextPage, goToPrevPage, requestSort,
    };
};