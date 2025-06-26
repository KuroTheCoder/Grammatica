// components/admin/ConfirmActionModal.tsx (Upgraded with Theming)
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaLock, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import PulseLoader from '@/components/ui/PulseLoader';

// --- NEW: Theming System ---
// Define the possible "intents" or themes for our modal.
export type ModalIntent = 'danger' | 'warning' | 'success' | 'info';

// Map each intent to specific Tailwind classes and a corresponding icon.
const INTENT_THEMES = {
    danger: {
        icon: <FaExclamationTriangle className="h-6 w-6 text-red-400" />,
        iconContainer: 'bg-red-900/50',
        title: 'text-red-300',
        confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
        icon: <FaLock className="h-6 w-6 text-yellow-400" />,
        iconContainer: 'bg-yellow-900/50',
        title: 'text-yellow-300',
        confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    success: {
        icon: <FaCheckCircle className="h-6 w-6 text-emerald-400" />,
        iconContainer: 'bg-emerald-900/50',
        title: 'text-emerald-300',
        confirmButton: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
    },
    info: {
        icon: <FaInfoCircle className="h-6 w-6 text-sky-400" />,
        iconContainer: 'bg-sky-900/50',
        title: 'text-sky-300',
        confirmButton: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500',
    },
};
// --- END NEW ---

interface ConfirmActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    isConfirming: boolean;
    intent?: ModalIntent; // NEW PROP: This will control the theme
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onConfirm,
                                                                   title,
                                                                   message,
                                                                   confirmText = "Confirm",
                                                                   isConfirming,
                                                                   intent = 'danger', // Default to 'danger' if no intent is provided
                                                               }) => {
    // Get the correct theme object based on the intent prop.
    const theme = INTENT_THEMES[intent];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-slate-800/80 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start">
                            {/* These classes are now DYNAMIC based on the theme */}
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${theme.iconContainer} sm:mx-0 sm:h-10 sm:w-10`}>
                                {theme.icon}
                            </div>
                            <div className="ml-4 text-left">
                                <h3 className={`text-lg font-bold ${theme.title}`} id="modal-title">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-300">{message}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                            <button
                                type="button"
                                // The confirm button's color is also DYNAMIC
                                className={`w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[40px] ${theme.confirmButton}`}
                                onClick={onConfirm}
                                disabled={isConfirming}
                            >
                                {isConfirming ? <PulseLoader className="h-5" /> : confirmText}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:w-auto sm:text-sm transition-all"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmActionModal;