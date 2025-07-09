// components/modals/BadgeModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaAward, FaUserAstronaut, FaFire } from 'react-icons/fa';

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

// TODO: Replace this with actual badge data fetched from the user's profile
const hardcodedBadges: Badge[] = [
    {
        id: 'pioneer',
        icon: FaUserAstronaut,
        color: '#A78BFA',
        tooltip: 'Pioneer',
        description: 'Joined Grammatica during the beta phase.',
        earnedOn: '2024-07-09',
    },
    {
        id: 'streak-7',
        icon: FaFire,
        color: '#F97316',
        tooltip: '7-Day Streak',
        description: 'Kept the learning flame alive for a whole week!',
        earnedOn: '2024-07-08',
    },
];

const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, badges = hardcodedBadges }) => {
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Trophy Case"
            titleIcon={FaAward}
            headerGradient="from-amber-400 to-yellow-500"
            backgroundClassName="bg-gradient-to-br from-gray-900 to-black [box-shadow:0_0_20px_rgba(252,212,74,0.5)]"
        >
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