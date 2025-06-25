// components/admin/UserActionsModal.tsx
"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPen, FaLock, FaUserSlash, FaCheckCircle } from 'react-icons/fa';
import { UserData } from '@/app/(Admin)/admin/users/page'; // Import the type

type UserStatus = 'active' | 'locked' | 'banned';

interface UserActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
    onEdit: () => void;
    onStatusChange: (uid: string, status: UserStatus) => void;
}

const actionItems: { status: UserStatus; label: string; icon: React.ElementType; className: string }[] = [
    { status: 'active', label: 'Activate User', icon: FaCheckCircle, className: 'text-green-400 hover:bg-green-500/10' },
    { status: 'locked', label: 'Lock User (Read-only)', icon: FaLock, className: 'text-yellow-400 hover:bg-yellow-500/10' },
    { status: 'banned', label: 'Ban User (No Access)', icon: FaUserSlash, className: 'text-red-400 hover:bg-red-500/10' },
];

const UserActionsModal: React.FC<UserActionsModalProps> = ({ isOpen, onClose, user, onEdit, onStatusChange }) => {

    if (!user) return null; // Don't render if there's no user selected

    const currentStatus = user.status?.type || 'active';

    const handleEditClick = () => {
        onClose(); // Close this modal first
        onEdit();  // Then open the edit modal
    };

    const handleStatusClick = (status: UserStatus) => {
        onClose(); // Close this modal
        onStatusChange(user.uid, status);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-sm text-white shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-200">Actions for</h3>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 font-semibold truncate">{user.email}</p>
                        </div>

                        <div className="border-t border-slate-700/50 px-3 py-2 space-y-1">
                             <button onClick={handleEditClick} className="group flex w-full items-center rounded-md p-3 text-sm text-slate-200 hover:bg-sky-500/10 hover:text-sky-300 transition-colors">
                                <FaPen className="mr-3 h-5 w-5 text-sky-400" aria-hidden="true" /> Edit Role
                            </button>
                            {actionItems.map(item => (
                                <button
                                    key={item.status}
                                    onClick={() => handleStatusClick(item.status)}
                                    disabled={currentStatus === item.status}
                                    className={`group flex w-full items-center rounded-md p-3 text-sm transition-colors ${item.className} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" aria-hidden="true" /> {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserActionsModal;