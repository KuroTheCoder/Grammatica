
// components/ui/RankBadge.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaMedal } from 'react-icons/fa';

interface RankBadgeProps {
    rank: number;
    className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, className }) => {
    const handleClick = () => {
        console.log(`Rank badge clicked for rank: ${rank}`);
        // Add any desired action here, e.g., open a leaderboard modal
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg ${className}`}
        >
            <FaMedal />
            <span className="font-bold">#{rank}</span>
            <span className="font-semibold text-sm">in class</span>
        </motion.button>
    );
};

export default RankBadge;
