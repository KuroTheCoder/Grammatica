// components/modals/BadgeModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

// We'll get this data from props later
interface Badge {
    id: string;
    icon: IconType;
    color: string;
    tooltip: string; // This will be the name of the badge
    description?: string; // A cool flavor text for the badge
    earnedOn?: string; // The date they earned it
}

interface BadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    badges: Badge[];
}

const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, badges }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Trophy Case">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2"
            >
                {badges.length > 0 ? (
                    badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            variants={itemVariants}
                            className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/20 transition-all"
                        >
                            <div className="flex-shrink-0" style={{ color: badge.color, filter: `drop-shadow(0 0 8px ${badge.color})`}}>
                                <badge.icon size={48} />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-white text-lg">{badge.tooltip}</h4>
                                <p className="text-sm text-gray-300">{badge.description || "An awesome achievement!"}</p>
                            </div>
                            {badge.earnedOn && (
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-xs text-gray-400">Earned</p>
                                    <p className="text-sm font-semibold text-gray-200">{badge.earnedOn}</p>
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-8">No badges earned yet. Go crush some lessons!</p>
                )}
            </motion.div>
        </Modal>
    );
};

export default BadgeModal;