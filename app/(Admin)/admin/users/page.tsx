// app/(Admin)/admin/users/page.tsx (Final Version with Themed Confirmation Modal)
"use client";

import React, {useState, useMemo, useEffect} from 'react';
import {
    FaUserShield,
    FaUserGraduate,
    FaUserTie,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaSearch,
    FaUser,
    FaEnvelope,
    FaUsers,
    FaClock,
    FaExclamationTriangle,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import {motion} from 'framer-motion';
import {
    collection,
    doc,
    query,
    updateDoc,
    Timestamp,
    limit,
    startAfter,
    endBefore,
    getDocs,
    orderBy,
    QueryDocumentSnapshot,
    DocumentData,
    limitToLast,
    where
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {useDebounce} from '@/hooks/useDebounce';
import dynamic from 'next/dynamic';

// ===== Dynamic Imports for Performance =====
import type { ModalIntent } from '@/components/admin/ConfirmActionModal'; // === THEME UPDATE: Import the type ===
const EditUserModal = dynamic(() => import('@/components/admin/EditUserModal'));
const UserActionsModal = dynamic(() => import('@/components/admin/UserActionsModal'));
const UserActionsButton = dynamic(() => import('@/components/admin/UserActionsMenu'));
const ConfirmActionModal = dynamic(() => import('@/components/admin/ConfirmActionModal'));
// ===========================================

export type UserStatus = 'active' | 'locked' | 'banned';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: string[];
    class?: string;
    created?: Timestamp;
    status?: { type: UserStatus; reason?: string; };
}

type SortableKeys = 'displayName' | 'email' | 'class' | 'created';
type SortConfig = { key: SortableKeys; direction: 'asc' | 'desc'; };

const ROLES_FILTER = ['student', 'teacher', 'admin'];

// ====================================================================
// ===== STYLING HELPERS (Untouched) =====
// ====================================================================
const GRADE_PALETTES: { [key: string]: { bg: string, text: string, border: string }[] } = {
    '10': [{bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30'}, {
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-500/30'
    }, {bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30'},],
    '11': [{bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30'}, {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-300',
        border: 'border-yellow-500/30'
    }, {bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30'},],
    '12': [{bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30'}, {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/30'
    }, {bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30'},],
    'default': [{bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50'}]
};
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
};
const getGradeFromClassName = (className: string): string => {
    if (!className) return 'default';
    const upperClassName = className.toUpperCase();
    if (upperClassName.startsWith('10') || upperClassName.includes('A')) return '10';
    if (upperClassName.startsWith('11') || upperClassName.includes('B')) return '11';
    if (upperClassName.startsWith('12') || upperClassName.includes('C')) return '12';
    return 'default';
};
const getClassBadge = (className: string | undefined) => {
    if (!className) {
        return <span
            className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">N/A</span>;
    }
    const grade = getGradeFromClassName(className);
    const palette = GRADE_PALETTES[grade];
    const hash = simpleHash(className);
    const color = palette[hash % palette.length];
    return (<span
        className={`px-2 py-1 text-xs font-medium rounded-full ${color.bg} ${color.text} ${color.border}`}> {className} </span>);
};
const getRoleBadge = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return <span className="text-xs text-slate-500">No Role</span>;
    return <div className="flex flex-wrap gap-1">{roles.map(role => {
        if (role === 'admin') return <span key={role}
                                           className="flex items-center gap-1 text-xs font-medium bg-red-800/70 text-red-300 px-2 py-1 rounded-full border border-red-500/30"><FaUserShield/> Admin</span>;
        if (role === 'teacher') return <span key={role}
                                             className="flex items-center gap-1 text-xs font-medium bg-sky-800/70 text-sky-300 px-2 py-1 rounded-full border border-sky-500/30"><FaUserTie/> Teacher</span>;
        if (role === 'student') return <span key={role}
                                             className="flex items-center gap-1 text-xs font-medium bg-slate-700/70 text-slate-300 px-2 py-1 rounded-full border border-slate-500/30"><FaUserGraduate/> Student</span>;
        return null;
    })}</div>;
};
const getUserNameColor = (roles: string[] | undefined): string => {
    if (!roles) return 'text-slate-200';
    if (roles.includes('admin')) return 'text-red-400';
    if (roles.includes('teacher')) return 'text-sky-400';
    return 'text-slate-200';
};
const getRowStyle = (statusType: UserStatus | undefined) => {
    switch (statusType) {
        case 'banned':
            return 'bg-red-900/30 hover:bg-red-900/40';
        case 'locked':
            return 'bg-yellow-900/30 hover:bg-yellow-900/40';
        default:
            return 'hover:bg-slate-800/60';
    }
};
// ====================================================================

const USERS_PER_PAGE = 25;

const UserManagementPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const [page, setPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [selectedUserForAction, setSelectedUserForAction] = useState<UserData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // === THEME UPDATE: Add `intent` to the modal state ===
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: React.ReactNode;
        onConfirm: () => void;
        intent: ModalIntent;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        intent: 'danger',
    });

    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'displayName', direction: 'asc'});
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);
    const [availableGrades, setAvailableGrades] = useState<string[]>([]);
    const [groupedClasses, setGroupedClasses] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const fetchFilterOptions = async () => {
            const q = query(collection(db, 'users'));
            const userSnapshot = await getDocs(q);
            const classSet = new Set<string>();
            userSnapshot.docs.forEach(doc => doc.data().class && classSet.add(doc.data().class));
            const classes = Array.from(classSet).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
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
        };
        fetchFilterOptions();
    }, []);

    const fetchUsers = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        // ... fetchUsers logic (unchanged)
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
            const fetchedUsers = documentSnapshots.docs.map(doc => ({uid: doc.id, ...doc.data()} as UserData));
            setUsers(fetchedUsers);
            if (documentSnapshots.docs.length > 0) {
                setFirstDoc(documentSnapshots.docs[0]);
                setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            }
            setIsLastPage(documentSnapshots.docs.length < USERS_PER_PAGE);
        } catch (err: unknown) {
            console.error("Firebase Query Error:", err);
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error('An unknown error occurred.'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setLastDoc(null);
        setFirstDoc(null);
        setIsLastPage(false);
        fetchUsers('initial');
    }, [sortConfig, selectedRole, selectedClass, selectedGrade]);

    const goToNextPage = () => {
        if (!isLastPage) {
            setPage(p => p + 1);
            fetchUsers('next');
        }
    };
    const goToPrevPage = () => {
        if (page > 1) {
            setPage(p => p - 1);
            fetchUsers('prev');
        }
    };

    const processedUsers = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase();
        if (!term) return users;
        return users.filter(user => (user.displayName || '').toLowerCase().includes(term) || (user.email || '').toLowerCase().includes(term));
    }, [users, debouncedSearchTerm]);

    const requestSort = (key: SortableKeys) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <FaSort className="inline-block ml-2 text-slate-600"/>;
        return sortConfig.direction === 'asc' ? <FaSortUp className="inline-block ml-2 text-emerald-400"/> :
            <FaSortDown className="inline-block ml-2 text-emerald-400"/>;
    };
    const handleOpenEditModal = (user: UserData) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };
    const handleSaveRoles = async (userId: string, newRoles: string[]) => {
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'users', userId), {role: newRoles});
            handleCloseEditModal();
            const updatedUsers = users.map(u => u.uid === userId ? {...u, role: newRoles} : u);
            setUsers(updatedUsers);
        } catch (err) {
            console.error("Failed to update user roles:", err);
        } finally {
            setIsSaving(false);
        }
    };
    const handleOpenActionsModal = (user: UserData) => {
        setSelectedUserForAction(user);
        setIsActionsModalOpen(true);
    };
    const handleCloseActionsModal = () => {
        setIsActionsModalOpen(false);
        setTimeout(() => setSelectedUserForAction(null), 300);
    };

    // === THEME UPDATE: Final version of the function with intent logic ===
    const handleStatusChange = (uid: string, statusType: UserStatus, reason?: string) => {
        const getIntentForStatus = (status: UserStatus): ModalIntent => {
            if (status === 'banned') return 'danger';
            if (status === 'locked') return 'warning';
            return 'success'; // for 'active'
        };

        const intent = getIntentForStatus(statusType);

        const performAction = async () => {
            setIsConfirming(true);
            try {
                await updateDoc(doc(db, 'users', uid), { status: { type: statusType, reason: reason || '' } });
                const updatedUsers = users.map(u => u.uid === uid ? { ...u, status: { type: statusType, reason } } : u);
                setUsers(updatedUsers);
                handleCloseActionsModal();
                setConfirmModalState(s => ({ ...s, isOpen: false }));
            } catch (err) {
                console.error("Failed to update user status:", err);
            } finally {
                setIsConfirming(false);
            }
        };

        const verb = statusType === 'active' ? 'reactivate' : statusType;

        setConfirmModalState({
            isOpen: true,
            title: `Confirm User ${verb.charAt(0).toUpperCase() + verb.slice(1)}`,
            message: (
                <>
                    Are you sure you want to <strong>{verb}</strong> this user?
                    This action will take effect immediately.
                </>
            ),
            onConfirm: performAction,
            intent: intent,
        });
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                {/* ... your h1 and filter inputs (unchanged) ... */}
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-6">User
                    Management</h1>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FaSearch
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                        <input type="text" placeholder="Search current page..." value={searchTerm}
                               onChange={e => setSearchTerm(e.target.value)}
                               className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300"/>
                    </div>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300">
                        <option value="">All Roles</option>
                        {ROLES_FILTER.map(name => <option key={name} value={name}
                                                          className="capitalize">{name}</option>)}
                    </select>
                    <select value={selectedGrade} onChange={e => {
                        setSelectedGrade(e.target.value);
                        setSelectedClass('');
                    }}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300">
                        <option value="">All Grades</option>
                        {availableGrades.map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
                    </select>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                            disabled={!availableClasses.length}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300 disabled:opacity-50">
                        <option value="">{selectedGrade ? `All Grade ${selectedGrade}` : 'All Classes'}</option>
                        {selectedGrade ?
                            (groupedClasses[`Grade ${selectedGrade}`] || []).map(name => <option key={name}
                                                                                                 value={name}>{name}</option>) :
                            Object.entries(groupedClasses).map(([groupLabel, classes]) => (
                                <optgroup key={groupLabel} label={groupLabel}>
                                    {classes.map(name => <option key={name} value={name}>{name}</option>)}
                                </optgroup>
                            ))
                        }
                    </select>
                </div>

                <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        {/* ... your table head (unchanged) ... */}
                        <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('displayName')}
                                               className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">{sortConfig.key === 'displayName' &&
                                    <motion.div layoutId="sort-indicator-glow"
                                                className="absolute inset-0 bg-sky-500/10 rounded-md"
                                                transition={{type: 'spring', stiffness: 400, damping: 30}}/>}<span
                                    className="relative flex items-center text-sky-400 group-hover:text-sky-300 transition-colors"><FaUser
                                    className="mr-2"/> DISPLAYNAME {getSortIcon('displayName')}</span></motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('email')}
                                               className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">{sortConfig.key === 'email' &&
                                    <motion.div layoutId="sort-indicator-glow"
                                                className="absolute inset-0 bg-indigo-500/10 rounded-md"
                                                transition={{type: 'spring', stiffness: 400, damping: 30}}/>}<span
                                    className="relative flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors"><FaEnvelope
                                    className="mr-2"/> EMAIL {getSortIcon('email')}</span></motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('class')}
                                               className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">{sortConfig.key === 'class' &&
                                    <motion.div layoutId="sort-indicator-glow"
                                                className="absolute inset-0 bg-amber-500/10 rounded-md"
                                                transition={{type: 'spring', stiffness: 400, damping: 30}}/>}<span
                                    className="relative flex items-center text-amber-400 group-hover:text-amber-300 transition-colors"><FaUsers
                                    className="mr-2"/> CLASS {getSortIcon('class')}</span></motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('created')}
                                               className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">{sortConfig.key === 'created' &&
                                    <motion.div layoutId="sort-indicator-glow"
                                                className="absolute inset-0 bg-emerald-500/10 rounded-md"
                                                transition={{type: 'spring', stiffness: 400, damping: 30}}/>}<span
                                    className="relative flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors"><FaClock
                                    className="mr-2"/> CREATED {getSortIcon('created')}</span></motion.button>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                            <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                        {/* ... your table body rendering logic (unchanged) ... */}
                        {loading && <tr>
                            <td colSpan={6} className="text-center p-8 text-slate-400">Loading Users...</td>
                        </tr>}
                        {error && <tr className="bg-red-900/20">
                            <td colSpan={6} className="text-center p-8 text-red-300 font-mono">Error: {error.message}
                                <br/> <span className="text-xs text-red-400">(Check console for details)</span>
                            </td>
                        </tr>}
                        {!loading && processedUsers.length === 0 && (<tr>
                            <td colSpan={6} className="text-center p-8 text-slate-500">No users match your criteria.
                            </td>
                        </tr>)}
                        {!loading && processedUsers.map((user) => (
                            <tr key={user.uid}
                                className={`${getRowStyle(user.status?.type)} transition-colors duration-300`}>
                                <td className={`px-6 py-4 font-semibold whitespace-nowrap ${getUserNameColor(user.role)}`}>{user.displayName || 'N/A'}{user.status?.type !== 'active' &&
                                    <FaExclamationTriangle
                                        className={`inline ml-2 ${user.status?.type === 'banned' ? 'text-red-500' : 'text-yellow-500'}`}
                                        title={`Status: ${user.status?.type}`}/>}</td>
                                <td className="px-6 py-4 text-indigo-300 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4">{getClassBadge(user.class)}</td>
                                <td className="px-6 py-4 text-emerald-300 whitespace-nowrap">{user.created?.toDate().toLocaleDateString('vi-VN') || 'N/A'}</td>
                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                <td className="px-6 py-4 text-right"><UserActionsButton
                                    onClickAction={() => handleOpenActionsModal(user)}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                    {/* ... your pagination controls (unchanged) ... */}
                    <button onClick={goToPrevPage} disabled={page <= 1}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <FaChevronLeft/> Previous
                    </button>
                    <span className="text-sm text-slate-400">Page {page}</span>
                    <button onClick={goToNextPage} disabled={isLastPage}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next <FaChevronRight/>
                    </button>
                </div>
            </div>

            <EditUserModal isOpen={isEditModalOpen} user={editingUser} onClose={handleCloseEditModal}
                           onSave={handleSaveRoles} isSaving={isSaving}/>
            <UserActionsModal isOpen={isActionsModalOpen} onClose={handleCloseActionsModal} user={selectedUserForAction}
                              onEdit={() => selectedUserForAction && handleOpenEditModal(selectedUserForAction)}
                              onStatusChange={(uid, status) => selectedUserForAction && handleStatusChange(uid, status)}/>

            {/* === THEME UPDATE: Pass the intent to the rendered modal === */}
            <ConfirmActionModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState(s => ({...s, isOpen: false}))}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
                isConfirming={isConfirming}
                confirmText={`Yes, proceed`}
                intent={confirmModalState.intent}
            />
        </>
    );
};

export default UserManagementPage;