"use client";

import React, { useState } from 'react';
import {
    FaClock, FaEnvelope, FaExclamationTriangle,
    FaSearch, FaSort, FaSortDown, FaSortUp, FaUser, FaUserGraduate, FaUsers, FaUserShield, FaUserTie
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import dynamic from 'next/dynamic';
import { useUserManagement } from '@/hooks/useUserManagement';
import type { UserData, UserStatus, SortableKeys } from '@/types/user';
import type { ModalIntent } from '@/components/admin/ConfirmActionModal';
const EditUserModal = dynamic(() => import('@/components/admin/EditUserModal'));
const UserActionsModal = dynamic(() => import('@/components/admin/UserActionsModal'));
const UserActionsButton = dynamic(() => import('@/components/admin/UserActionsMenu'));
const ConfirmActionModal = dynamic(() => import('@/components/admin/ConfirmActionModal'));

const ROLES_FILTER = ['student', 'teacher', 'admin'];

// Styling helpers remain unchanged...
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
        return <span className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">N/A</span>;
    }
    const grade = getGradeFromClassName(className);
    const palette = GRADE_PALETTES[grade];
    const hash = simpleHash(className);
    const color = palette[hash % palette.length];
    return (<span className={`px-2 py-1 text-xs font-medium rounded-full ${color.bg} ${color.text} ${color.border}`}> {className} </span>);
};
const getRoleBadge = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return <span className="text-xs text-slate-500">No Role</span>;
    return <div className="flex flex-wrap gap-1">{roles.map(role => {
        if (role === 'admin') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-red-800/70 text-red-300 px-2 py-1 rounded-full border border-red-500/30"><FaUserShield/> Admin</span>;
        if (role === 'teacher') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-sky-800/70 text-sky-300 px-2 py-1 rounded-full border border-sky-500/30"><FaUserTie/> Teacher</span>;
        if (role === 'student') return <span key={role} className="flex items-center gap-1 text-xs font-medium bg-slate-700/70 text-slate-300 px-2 py-1 rounded-full border border-slate-500/30"><FaUserGraduate/> Student</span>;
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
    // ===== THE FIX: De-structure only what the hook exports NOW =====
    const {
        loading, error, sortConfig, searchTerm,
        selectedRole, selectedGrade, selectedClass, availableClasses,
        availableGrades, groupedClasses, processedUsers, // No more pagination or setUsers!
        setSearchTerm, setSelectedRole, setSelectedGrade, setSelectedClass,
        requestSort,
    } = useUserManagement();

    // Modal state is still perfect.
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [selectedUserForAction, setSelectedUserForAction] = useState<UserData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean; title: string; message: React.ReactNode;
        onConfirm: () => void; intent: ModalIntent;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, intent: 'danger' });

    // This function is still perfect.
    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <FaSort className="inline-block ml-2 text-slate-600" />;
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="inline-block ml-2 text-emerald-400" />
            : <FaSortDown className="inline-block ml-2 text-emerald-400" />;
    };

    // Modal handlers are still perfect.
    const handleOpenEditModal = (user: UserData) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };
    const handleOpenActionsModal = (user: UserData) => {
        setSelectedUserForAction(user);
        setIsActionsModalOpen(true);
    };
    const handleCloseActionsModal = () => {
        setIsActionsModalOpen(false);
        setTimeout(() => setSelectedUserForAction(null), 300);
    };

    // ===== THE FIX: These functions no longer need to call setUsers! =====
    // The real-time listener will handle the UI update automatically.
    const handleSaveRoles = async (userId: string, newRoles: string[]) => {
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRoles });
            handleCloseEditModal();
        } catch (err) {
            console.error("Failed to update user roles:", err);
            // Optionally set an error state to show in the UI
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = (uid: string, statusType: UserStatus, reason?: string) => {
        const getIntentForStatus = (status: UserStatus): ModalIntent => {
            if (status === 'banned') return 'danger';
            if (status === 'locked') return 'warning';
            return 'success';
        };
        const intent = getIntentForStatus(statusType);
        const performAction = async () => {
            setIsConfirming(true);
            try {
                await updateDoc(doc(db, 'users', uid), { status: { type: statusType, reason: reason || '' } });
                handleCloseActionsModal();
                setConfirmModalState(s => ({ ...s, isOpen: false }));
            } catch (err) {
                console.error("Failed to update user status:", err);
                // Optionally set an error state
            } finally {
                setIsConfirming(false);
            }
        };
        const verb = statusType === 'active' ? 'reactivate' : statusType;
        setConfirmModalState({
            isOpen: true,
            title: `Confirm User ${verb.charAt(0).toUpperCase() + verb.slice(1)}`,
            message: <p>Are you sure you want to <strong>{verb}</strong> this user?</p>,
            onConfirm: performAction,
            intent: intent,
        });
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-6">User Management</h1>

                {/* Filter section is perfect */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                               className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-10 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300"/>
                    </div>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300">
                        <option value="">All Roles</option>
                        {ROLES_FILTER.map(name => <option key={name} value={name} className="capitalize">{name}</option>)}
                    </select>
                    <select value={selectedGrade} onChange={e => { setSelectedGrade(e.target.value); setSelectedClass(''); }}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300">
                        <option value="">All Grades</option>
                        {availableGrades.map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
                    </select>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} disabled={!availableClasses.length}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-300 disabled:opacity-50">
                        <option value="">{selectedGrade ? `All Grade ${selectedGrade}` : 'All Classes'}</option>
                        {selectedGrade ?
                            (groupedClasses[`Grade ${selectedGrade}`] || []).map(name => <option key={name} value={name}>{name}</option>) :
                            Object.entries(groupedClasses).map(([groupLabel, classes]) => (
                                <optgroup key={groupLabel} label={groupLabel}>
                                    {classes.map(name => <option key={name} value={name}>{name}</option>)}
                                </optgroup>
                            ))
                        }
                    </select>
                </div>

                {/* Table section is mostly perfect */}
                <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('displayName')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'displayName' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-sky-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-sky-400 group-hover:text-sky-300 transition-colors"><FaUser className="mr-2" /> DISPLAYNAME {getSortIcon('displayName')}</span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('email')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'email' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-indigo-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors"><FaEnvelope className="mr-2" /> EMAIL {getSortIcon('email')}</span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('class')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'class' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-amber-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-amber-400 group-hover:text-amber-300 transition-colors"><FaUsers className="mr-2" /> CLASS {getSortIcon('class')}</span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                <motion.button onClick={() => requestSort('created')} className="group flex items-center text-xs font-medium uppercase tracking-wider relative p-2 rounded-md">
                                    {sortConfig.key === 'created' && <motion.div layoutId="sort-indicator-glow" className="absolute inset-0 bg-emerald-500/10 rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                                    <span className="relative flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors"><FaClock className="mr-2" /> CREATED {getSortIcon('created')}</span>
                                </motion.button>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                            <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                        {loading && <tr><td colSpan={6} className="text-center p-8 text-slate-400">Gearing up the User-Tron 5000...</td></tr>}
                        {error && <tr className="bg-red-900/20"><td colSpan={6} className="text-center p-8 text-red-300 font-mono">Error: {error.message}</td></tr>}
                        {!loading && processedUsers.length === 0 && (<tr><td colSpan={6} className="text-center p-8 text-slate-500">No users match your criteria.</td></tr>)}
                        {!loading && processedUsers.map((user) => (
                            <tr key={user.uid} className={`${getRowStyle(user.status?.type)} transition-colors duration-300`}>
                                <td className={`px-6 py-4 font-semibold whitespace-nowrap ${getUserNameColor(user.role)}`}>{user.displayName || 'N/A'}{user.status?.type !== 'active' && <FaExclamationTriangle className={`inline ml-2 ${user.status?.type === 'banned' ? 'text-red-500' : 'text-yellow-500'}`} title={`Status: ${user.status?.type}`} />}</td>
                                <td className="px-6 py-4 text-indigo-300 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4">{getClassBadge(user.class)}</td>
                                <td className="px-6 py-4 text-emerald-300 whitespace-nowrap">{user.created?.toDate().toLocaleDateString('vi-VN') || 'N/A'}</td>
                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                <td className="px-6 py-4 text-right"><UserActionsButton onClickAction={() => handleOpenActionsModal(user)} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== THE FIX: Pagination is GONE! ===== */}
                {/* We can add a simple count instead for context */}
                <div className="flex items-center justify-end mt-6">
                    <span className="text-sm text-slate-400">
                        Showing {processedUsers.length} user(s)
                    </span>
                </div>
            </div>

            <EditUserModal isOpen={isEditModalOpen} user={editingUser} onClose={handleCloseEditModal} onSave={handleSaveRoles} isSaving={isSaving} />
            <UserActionsModal isOpen={isActionsModalOpen} onClose={handleCloseActionsModal} user={selectedUserForAction} onEdit={() => selectedUserForAction && handleOpenEditModal(selectedUserForAction)} onStatusChange={(uid, status) => selectedUserForAction && handleStatusChange(uid, status)} />
            <ConfirmActionModal isOpen={confirmModalState.isOpen} onClose={() => setConfirmModalState(s => ({ ...s, isOpen: false }))} onConfirm={confirmModalState.onConfirm} title={confirmModalState.title} message={confirmModalState.message} isConfirming={isConfirming} confirmText={`Yes, proceed`} intent={confirmModalState.intent} />
        </>
    );
};

export default UserManagementPage;