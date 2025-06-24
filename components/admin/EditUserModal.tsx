// components/admin/EditUserModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaUserShield, FaUserGraduate, FaUserTie } from 'react-icons/fa';

// Define the shape of the user data we expect
interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: string[];
}

// Define the props our modal will accept
interface EditUserModalProps {
    isOpen: boolean;
    user: UserData | null;
    onClose: () => void;
    onSave: (userId: string, newRoles: string[]) => Promise<void>;
    isSaving: boolean;
}

const ALL_ROLES = [
    { id: 'student', name: 'Student', icon: <FaUserGraduate/> },
    { id: 'teacher', name: 'Teacher', icon: <FaUserTie/> },
    { id: 'admin', name: 'Admin', icon: <FaUserShield/> },
];

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSave, isSaving }) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        // When a new user is selected, update the roles in our state
        if (user?.role) {
            setSelectedRoles(user.role);
        } else if (!user) {
            // Good practice to clear roles if no user is selected
            setSelectedRoles([]);
        }
    }, [user]);

    const handleRoleChange = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
        );
    };

    const handleSaveClick = () => {
        if (user) {
            onSave(user.uid, selectedRoles);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6 text-white shadow-2xl"
                        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
                    >
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Edit User Role</h2>
                        <p className="text-slate-400 mt-1 mb-6">Editing profile for: <span className="font-semibold text-slate-200">{user?.email}</span></p>

                        <div className="space-y-3">
                            <p className="font-semibold text-slate-300">Roles:</p>
                            {ALL_ROLES.map(role => (
                                <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded bg-slate-600 border-slate-500 text-emerald-500 focus:ring-emerald-500"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => handleRoleChange(role.id)}
                                    />
                                    <div className="flex items-center gap-2 text-slate-200">
                                        {role.icon} {role.name}
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-md bg-slate-600 hover:bg-slate-500 font-semibold transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleSaveClick} disabled={isSaving} className="flex-1 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditUserModal;