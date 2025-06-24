// app/admin/users/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { FaUserShield, FaUserGraduate, FaUserTie, FaSort, FaSortUp, FaSortDown, FaSearch, FaUser, FaEnvelope, FaUsers, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EditUserModal from '@/components/admin/EditUserModal';
import UserActionsButton from '@/components/admin/UserActionsMenu';
import UserActionsModal from '@/components/admin/UserActionsModal';
import { collection, doc, query, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export type UserStatus = 'active' | 'locked' | 'banned';
export interface UserData {
    uid: string; email: string; displayName: string; role: string[]; class?: string; created?: Timestamp;
    status?: { type: UserStatus; reason?: string; };
}
type SortableKeys = 'displayName' | 'email' | 'class' | 'created';
type SortConfig = { key: SortableKeys; direction: 'ascending' | 'descending'; };

const ROLES_FILTER = ['student', 'teacher', 'admin'];

// ====================================================================
// ===== THE FINAL "GRADIENT TONES" SYSTEM - Ngon lành! =====
// ====================================================================

const GRADE_PALETTES: { [key: string]: { bg: string, text: string, border: string }[] } = {
    '10': [
        { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
        { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
        { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
    ],
    '11': [
        { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
        { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
        { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
    ],
    '12': [
        { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30' },
        { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
        { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    ],
    'default': [
        { bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50' }
    ]
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

// FIX: The new, smarter helper function to get the correct grade
const getGradeFromClassName = (className: string): string => {
    const upperClassName = className.toUpperCase();
    if (upperClassName.startsWith('10') || upperClassName.includes('A')) return '10';
    if (upperClassName.startsWith('11') || upperClassName.includes('B')) return '11';
    if (upperClassName.startsWith('12') || upperClassName.includes('C')) return '12';
    return 'default'; // Fallback for any other case
};

// FIX: getClassBadge now uses our smart helper function
const getClassBadge = (className: string | undefined) => {
    if (!className) {
        return <span className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">N/A</span>;
    }
    const grade = getGradeFromClassName(className);
    const palette = GRADE_PALETTES[grade];
    const hash = simpleHash(className);
    const color = palette[hash % palette.length];

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${color.bg} ${color.text} ${color.border}`}>
            {className}
        </span>
    );
};
// ====================================================================

const getRoleBadge = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return <span className="text-xs text-slate-500">No Role</span>;
    return <div className="flex flex-wrap gap-1">{roles.map(role => {
        if (role === 'admin') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-red-800/70 text-red-300 px-2 py-1 rounded-full border border-red-500/30"><FaUserShield /> Admin</span>;
        if (role === 'teacher') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-sky-800/70 text-sky-300 px-2 py-1 rounded-full border border-sky-500/30"><FaUserTie /> Teacher</span>;
        if (role === 'student') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-slate-700/70 text-slate-300 px-2 py-1 rounded-full border border-slate-500/30"><FaUserGraduate /> Student</span>;
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
        case 'banned': return 'bg-red-900/30 hover:bg-red-900/40';
        case 'locked': return 'bg-yellow-900/30 hover:bg-yellow-900/40';
        default: return 'hover:bg-slate-800/60';
    }
};

const UserManagementPage = () => {
    const usersQuery = query(collection(db, 'users'));
    const [usersSnapshot, loading, error] = useCollection(usersQuery);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [selectedUserForAction, setSelectedUserForAction] = useState<UserData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'displayName', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const availableClasses = useMemo(() => {
        if (!usersSnapshot) return [];
        const classSet = new Set<string>();
        usersSnapshot.docs.forEach(doc => doc.data().class && classSet.add(doc.data().class));
        return Array.from(classSet).sort();
    }, [usersSnapshot]);

    const availableGrades = useMemo(() => {
        const gradeSet = new Set<string>();
        availableClasses.forEach(c => {
            const gradeKey = getGradeFromClassName(c);
            if(gradeKey !== 'default') {
                gradeSet.add(gradeKey);
            }
        });
        return Array.from(gradeSet).sort();
    }, [availableClasses]);

    const groupedClasses = useMemo(() => {
        const groups: { [key: string]: string[] } = {};
        availableGrades.forEach(grade => {
            groups[`Grade ${grade}`] = availableClasses
                .filter(c => getGradeFromClassName(c) === grade)
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        });
        return groups;
    }, [availableClasses, availableGrades]);

    const processedUsers = useMemo(() => {
        if (!usersSnapshot) return [];
        return usersSnapshot.docs
            .filter(doc => {
                const userClass = doc.data().class;
                if (selectedClass) return userClass === selectedClass;
                if (selectedGrade) return userClass && getGradeFromClassName(userClass) === selectedGrade;
                return true;
            })
            .filter(doc => selectedRole ? (doc.data().role || []).includes(selectedRole) : true)
            .filter(doc => {
                const term = searchTerm.toLowerCase(); if (!term) return true;
                const data = doc.data();
                return (data.displayName || '').toLowerCase().includes(term) || (data.email || '').toLowerCase().includes(term);
            })
            .sort((aDoc, bDoc) => {
                const a = aDoc.data(); const b = bDoc.data();
                const aValue = a[sortConfig.key]; const bValue = b[sortConfig.key];
                if (aValue === undefined || aValue === null) return 1; if (bValue === undefined || bValue === null) return -1;
                if (aValue instanceof Timestamp && bValue instanceof Timestamp) {
                    return sortConfig.direction === 'ascending' ? aValue.toMillis() - bValue.toMillis() : bValue.toMillis() - aValue.toMillis();
                }
                const strA = String(aValue).toLowerCase(); const strB = String(bValue).toLowerCase();
                if (strA < strB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (strA > strB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
    }, [usersSnapshot, searchTerm, selectedGrade, selectedClass, selectedRole, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        setSortConfig(current => ({ key, direction: current.key === key && current.direction === 'ascending' ? 'descending' : 'ascending' }));
    };

    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <FaSort className="inline-block ml-2 text-slate-600" />;
        return sortConfig.direction === 'ascending' ? <FaSortUp className="inline-block ml-2 text-emerald-400" /> : <FaSortDown className="inline-block ml-2 text-emerald-400" />;
    };

    const handleOpenEditModal = (user: UserData) => { setEditingUser(user); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditingUser(null); };
    const handleSaveRoles = async (userId: string, newRoles: string[]) => {
        setIsSaving(true);
        try { await updateDoc(doc(db, 'users', userId), { role: newRoles }); handleCloseEditModal(); }
        catch (err) { console.error("Failed to update user roles:", err); }
        finally { setIsSaving(false); }
    };

    const handleOpenActionsModal = (user: UserData) => {
        setSelectedUserForAction(user);
        setIsActionsModalOpen(true);
    };
    const handleCloseActionsModal = () => {
        setIsActionsModalOpen(false);
        setTimeout(() => setSelectedUserForAction(null), 300);
    };

    const handleStatusChange = async (uid: string, status: UserStatus) => {
        const confirmText = `Are you sure you want to ${status.toUpperCase()} this user?`;
        if (window.confirm(confirmText)) {
            try { await updateDoc(doc(db, 'users', uid), { status: { type: status } }); }
            catch (err) { console.error("Failed to update user status:", err); }
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-6">User Management</h1>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-1">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300"/>
                    </div>
                    <select
                        value={selectedGrade}
                        onChange={e => {
                            setSelectedGrade(e.target.value);
                            setSelectedClass('');
                        }}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300"
                    >
                        <option value="">All Grades</option>
                        {availableGrades.map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
                    </select>
                    <select
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        disabled={selectedGrade === '' && availableGrades.length > 0}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">{selectedGrade ? `All Grade ${selectedGrade} Classes` : 'All Classes'}</option>
                        {selectedGrade && groupedClasses[`Grade ${selectedGrade}`]?.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                        {!selectedGrade && Object.entries(groupedClasses).map(([groupLabel, classes]) => (
                            <optgroup key={groupLabel} label={groupLabel}>
                                {classes.map(name => <option key={name} value={name}>{name}</option>)}
                            </optgroup>
                        ))}
                    </select>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300">
                        <option value="">All Roles</option>
                        {ROLES_FILTER.map(name => <option key={name} value={name} className="capitalize">{name}</option>)}
                    </select>
                </div>

                <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('displayName')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'displayName' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-sky-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-sky-400 group-hover:text-sky-300 transition-colors">
                                        <FaUser className="mr-2"/> DISPLAYNAME {getSortIcon('displayName')}
                                    </span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('email')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'email' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-indigo-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                        <FaEnvelope className="mr-2"/> EMAIL {getSortIcon('email')}
                                    </span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('class')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'class' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-amber-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-amber-400 group-hover:text-amber-300 transition-colors">
                                        <FaUsers className="mr-2"/> CLASS {getSortIcon('class')}
                                    </span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('created')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'created' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-emerald-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                        <FaClock className="mr-2"/> CREATED {getSortIcon('created')}
                                    </span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                            <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                        {loading && <tr><td colSpan={6} className="text-center p-6 text-slate-400">Loading...</td></tr>}
                        {error && <tr className="bg-red-900/20"><td colSpan={6} className="text-center p-6 text-red-300 font-mono">{error.message}</td></tr>}
                        {!loading && processedUsers.length === 0 && (<tr><td colSpan={6} className="text-center p-6 text-slate-500">No users match your criteria.</td></tr>)}
                        {!loading && processedUsers.map((doc) => {
                            const user = { uid: doc.id, ...doc.data() } as UserData;
                            return (
                                <tr key={user.uid} className={`${getRowStyle(user.status?.type)} transition-colors duration-300`}>
                                    <td className={`px-6 py-4 font-semibold whitespace-nowrap ${getUserNameColor(user.role)}`}>
                                        {user.displayName || 'N/A'}
                                        {user.status?.type !== 'active' && <FaExclamationTriangle className={`inline ml-2 ${user.status?.type === 'banned' ? 'text-red-500' : 'text-yellow-500'}`} title={`Status: ${user.status?.type}`} />}
                                    </td>
                                    <td className="px-6 py-4 text-indigo-300 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4">{getClassBadge(user.class)}</td>
                                    <td className="px-6 py-4 text-emerald-300 whitespace-nowrap">{user.created?.toDate().toLocaleDateString('vi-VN') || 'N/A'}</td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <UserActionsButton
                                            onClickAction={() => handleOpenActionsModal(user)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditUserModal isOpen={isEditModalOpen} user={editingUser} onClose={handleCloseEditModal} onSave={handleSaveRoles} isSaving={isSaving}/>

            <UserActionsModal
                isOpen={isActionsModalOpen}
                onClose={handleCloseActionsModal}
                user={selectedUserForAction}
                onEdit={() => handleOpenEditModal(selectedUserForAction!)}
                onStatusChange={handleStatusChange}
            />
        </>
    );
};

export default UserManagementPage;