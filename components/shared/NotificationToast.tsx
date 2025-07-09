// components/shared/NotificationToast.tsx
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';

interface NotificationToastProps {
    message: string;
    icon?: IconType;
    gradient?: string; // Tailwind gradient classes
    isVisible: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, icon: Icon, gradient, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 min-w-[250px] max-w-sm text-white ${gradient ? `bg-gradient-to-r ${gradient}` : 'bg-gray-800'}`}
                >
                    {Icon && <Icon size={24} className="flex-shrink-0" />}
                    <p className="flex-grow text-center font-semibold">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
