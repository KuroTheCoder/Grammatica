// components/modals/StreakModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/shared/Modal';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import { Lock } from 'lucide-react';

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStreak: number;
}

const streakMilestones = [
    { day: 3, title: 'Spark', reward: 'Your journey begins.' },
    { day: 7, title: 'Kindling', reward: '+10 XP Boost' },
    { day: 14, title: 'Growing Flame', reward: 'Unlock a new profile border.' },
    { day: 30, title: 'Inferno', reward: '+50 XP Boost' },
    { day: 50, title: 'Wildfire', reward: 'Unlock "Flame" profile theme.' },
    { day: 100, title: 'Supernova', reward: '+200 XP Boost' },
    { day: 365, title: 'Eternal Flame', reward: 'Legendary "Phoenix" profile border.' },
];
const MAX_STREAK_DAY = 365;

// =================================================================================
// THE DYNAMIC FLAME ENGINE - This is already perfect, no changes needed.
// =================================================================================
interface RGBColor { r: number; g: number; b: number; }
const START_COLOR: RGBColor = { r: 251, g: 146, b: 60 };  // Orange-400
const END_COLOR: RGBColor = { r: 168, g: 85, b: 247 };   // Purple-500

const interpolateColor = (color1: RGBColor, color2: RGBColor, factor: number): string => {
    const r = Math.round(color1.r + factor * (color2.r - color1.r));
    const g = Math.round(color1.g + factor * (color2.g - color1.g));
    const b = Math.round(color1.b + factor * (color2.b - color1.b));
    return `rgb(${r}, ${g}, ${b})`;
};

const getColorForStreakDay = (day: number): string => {
    const clampedDay = Math.min(day, MAX_STREAK_DAY);
    const factor = clampedDay / MAX_STREAK_DAY;
    return interpolateColor(START_COLOR, END_COLOR, factor);
};
// =================================================================================


const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, currentStreak }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="The Path of Fire" titleIcon={FaFire}>
            <div className="flex flex-col items-center text-center p-4">
                {/* RESPONSIVE HEADER: Smaller on mobile, bigger on desktop */}
                <h3 className="text-4xl md:text-5xl font-black flex items-center gap-3" style={{ color: getColorForStreakDay(currentStreak) }}>
                    <FaFire /> {currentStreak}
                </h3>
                <p className="text-md md:text-lg text-gray-200 mb-6">Day Streak! Keep the flame alive.</p>

                {/* THE RESPONSIVE PATH: Using a before pseudo-element for a more robust line */}
                <div className="relative w-full flex flex-col items-start max-h-[50vh] overflow-y-auto pr-2
                                before:absolute before:top-0 before:bottom-0 before:left-6 sm:before:left-8 before:w-1 before:bg-white/10 before:rounded-full">

                    {streakMilestones.map((milestone, index) => {
                        const isUnlocked = currentStreak >= milestone.day;
                        const dynamicColor = getColorForStreakDay(milestone.day);

                        return (
                            <motion.div
                                key={milestone.day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: { type: 'spring', delay: index * 0.1 } }}
                                whileHover={{ scale: 1.02, boxShadow: `0 0 15px ${dynamicColor}` }}
                                // RESPONSIVE LAYOUT: Stacks on mobile, row on desktop!
                                className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full my-3 p-3 transition-all ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}
                            >
                                {/* Responsive Icon */}
                                <div className="z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gray-900 border-4 transition-all" style={{ borderColor: isUnlocked ? dynamicColor : '#4B5563' }}>
                                    {isUnlocked ? (
                                        <FaFire className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: dynamicColor }} />
                                    ) : (
                                        <Lock className="w-6 h-6 sm:w-8 sm-h-8 text-gray-500" />
                                    )}
                                </div>
                                {/* Responsive Text */}
                                <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-left">
                                    <h4 className="font-bold text-white">Day {milestone.day}: {milestone.title}</h4>
                                    <p className="text-sm text-gray-400">{milestone.reward}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default StreakModal;