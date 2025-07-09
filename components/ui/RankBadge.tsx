// components/ui/RankBadge.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { getRankStyle } from '@/lib/theme'; // Import getRankStyle

interface RankBadgeProps {
    rank: number;
    className?: string;
    onClick?: () => void; // Added onClick prop
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, className, onClick }) => { // Destructure onClick
    const handleClick = () => {
        console.log(`Rank badge clicked for rank: ${rank}`);
        // Add any desired action here, e.g., open a leaderboard modal
        onClick?.(); // Call onClick if it exists
    };

    const rankStyle = getRankStyle(rank); // Get the rank style

    return (
        <motion.button
            onClick={handleClick}
            // initial={{ opacity: 0, y: -10 }} // Removed initial prop to fix hydration
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Removed delay
            whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${rankStyle.color}`, transition: { type: 'spring', stiffness: 500, damping: 30 } }} // Added specific transition for whileHover
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${rankStyle.gradient} text-white border border-white/30 shadow-lg ${className}`} // Apply gradient and white text/border
        >
            <rankStyle.icon /> {/* Use dynamic icon */}
            <span className="font-bold">#{rank}</span>
            <span className="font-semibold text-sm">in class</span>
        </motion.button>
    );
};

export default RankBadge;